let messageContent = document.querySelector('#message-content')
let messengerDiv = document.querySelector('#messenger-div')
let padView = window.matchMedia("(max-width: 768px)");

window.addEventListener('resize',()=>{
    adjustMessengerSize()
})

adjustMessengerSize()

function adjustMessengerSize(){
    if (!padView.matches) {
        messengerDiv.style.height = messageContent.clientHeight + 'px'
    }
}


let additionAddMore = `<div class="uploadMore hidden">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
</div>`

// file send js
class MultipleUploader {

  #multipleUploader;
  #$imagesUploadInput;

  constructor( multiUploaderSelector )
  {
      this.#multipleUploader   = document.querySelector(multiUploaderSelector);
      this.#$imagesUploadInput = document.createElement('input')
  }

  init( { maxUpload = 20 , maxSize = 100000 , formSelector = '#my-form' , filesInpName = 'images'  } = {} )
  {

      const form = document.querySelector(formSelector);

      if (! this.#multipleUploader ) // check if the end user didnt write the multiple uploader div
          throw new Error('The multiple uploader element doesnt exist');

      if (! form ) // check if there is no form with this selector
          throw new Error('We couldn\'t find a form with this selector: ' + formSelector);

      // ensure that the form has enctype attribute with the value multipart/form-data
      form.enctype = 'multipart/form-data'

      if ( document.getElementById('max-upload-number') ){
          document.getElementById('max-upload-number').innerHTML = `Upload up to ${ maxUpload } files`;
      }

      // create multiple file input and make it hidden
      this.#$imagesUploadInput.type       = 'file';
      this.#$imagesUploadInput.name       = `${filesInpName}[]`;
      this.#$imagesUploadInput.multiple   = true;
      this.#$imagesUploadInput.accept     = "image/*";
      this.#$imagesUploadInput.style.setProperty('display','none','important');
      // create multiple file input and make it hidden

      // append the newly created input to the form with the help of the formSelector provided by the user
      document.querySelector(formSelector).append( this.#$imagesUploadInput );

      document.querySelector('.fileBtn').addEventListener("click", (e) => {
            this.#$imagesUploadInput.click()
             // trigger the input file to upload images
      });

      const self = this;
      this.#multipleUploader.innerHTML = additionAddMore
      // preview the uploaded images
      this.#$imagesUploadInput.addEventListener("change",function () {
        
        if (this.files.length > 0)
        {   
            
            document.querySelector('.uploadMore').classList.remove('hidden')
            document.querySelector('.uploadMore').classList.add('flex')

              // if the length of uploaded images greater than the images uploaded by the user, the maximum uploaded will be considered
            
                const uploadedImagesCount       = this.files.length > maxUpload ? maxUpload : this.files.length;
                const unAcceptableImagesIndices = [];
  
                for (let index = 0; index < uploadedImagesCount; index++) {
  
                const imageSize             = self.#bytesToSize( this.files[ index ].size );
                const isImageSizeAcceptable = self.#checkImageSize( index , imageSize , maxSize , 'MB' );
  
                self.#multipleUploader.innerHTML += `
                <div class="image-container" data-image-index="${ index }" id="mup-image-${ index }" data-acceptable-image="${ +isImageSizeAcceptable }" >
                    <div class="image-size"> ${ imageSize['size'] + ' ' + imageSize['unit'] } </div>
                    ${ !isImageSizeAcceptable ? `<div class="exceeded-size"> greater than ${ maxSize } MB </div>` : '' }
                    <img src="${ URL.createObjectURL( this.files[ index ]) }"  class="image-preview" alt="" />
                </div>`;
  
                if ( ! isImageSizeAcceptable )
                    unAcceptableImagesIndices.push( index )
  
                }
  
                unAcceptableImagesIndices.forEach( (index ) => self.#removeFileFromInput(index, false ))
                document.querySelector('.uploadMore').addEventListener('click',()=>{
                  self.#$imagesUploadInput.click()
                })
              // }
          }

      });

      // event for deleting uploaded images
      document.addEventListener('click',function(e){

          if( e.target.className === 'image-container' ) // clicked on remove pseudo element
          {
              const imageIndex        = e.target.getAttribute(`data-image-index`)
              const imageIsAcceptable = e.target.getAttribute(`data-acceptable-image`)

              e.target.remove() // remove the html element from the dom

              if ( +imageIsAcceptable )
                  self.#removeFileFromInput(imageIndex)

              if ( document.querySelectorAll('.image-container').length === 0 ) // if there are no images
                  self.clear();
                  

              self.#reorderFilesIndices(); // reorder images indices
          }

      });

      return this;

  }

  clear()
  {
      this.#multipleUploader.querySelectorAll('.image-container').forEach( image => image.remove() );
      this.#$imagesUploadInput.value = [];
      this.#multipleUploader.innerHTML = additionAddMore
  }

  #removeFileFromInput( deletedIndex )
  {
      // remove the delete file from input
      const dt = new DataTransfer()

      for (const [ index, file] of Object.entries( this.#$imagesUploadInput.files ))
      {
          if ( index != deletedIndex )
              dt.items.add( file )
      }
      this.#$imagesUploadInput.files = dt.files
      // remove the delete file from input
  }

  #reorderFilesIndices()
  {
      document.querySelectorAll('.image-container').forEach( ( element, index) => {
          element.setAttribute('data-image-index', index.toString() );
          element.setAttribute('id',`mup-image-${ index }`)
      });
  }

  #checkImageSize( imageIndex, imageSize , maxSize   )
  {
     return  imageSize['unit'] !== 'MB' || ( imageSize['unit'] === 'MB' && ( imageSize['size'] <= maxSize ) ) ; // return true if acceptable
  }

  #bytesToSize(bytes)
  {
      const sizes = ['Bytes', 'KB', 'MB']

      const i = parseInt( Math.floor(Math.log(bytes) / Math.log(1024) ), 10)

      if (i === 0)
          return {size: bytes , unit: sizes[i] }
      else
          return {size: (bytes / (1024 ** i)).toFixed(1) , unit: sizes[i] }
  }
}

let multipleUploader = new MultipleUploader('#multiple-uploader').init({
  maxUpload : 20, // maximum number of uploaded images
  maxSize:100, // in size in mb
  filesInpName:'images', // input name sent to backend
  formSelector: '#my-form', // form selector
});

// msg work

let msgInput = document.querySelector('.msg-input')
let msgSpace = document.querySelector('.msg-space')
let msgBtn = document.querySelector('.msg-btn')
let autoMsg = 'Hi! Thanks for your massege. Right now our admin is away. He will contact you soon.'
let autoMsg2 = 'Sorry for the delay. Wait a few minutes.'
let msgCount = 0
isAuto = true

let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
if(msgInput && msgSpace && msgBtn){

  msgBtn.addEventListener('click',()=>{
    getMsg(msgInput,msgSpace)
    getImg(msgSpace)
  })

  msgInput.addEventListener('keypress',(e)=>{
    if(e.key == 'Enter'){
        console.log('as');
      getMsg(msgInput,msgSpace)
      getImg(msgSpace)
    } 
  })

  function autoMsgFun(autoMsg,msgTime,space){
    msgCount = 0
    let time = new Date()
    
    let autoMsgDIV = document.createElement('div')
    autoMsgDIV.className = 'w-auto max-w-[90%] mt-auto'
    autoMsgDIV.innerHTML = `<div class="flex items-end space-x-2 justify-start">
                                <div class="shrink-0 size-[20px] 2xl:size-[30px]">
                                    <img src="../src/images/avatar.jpg" class="w-full h-full rounded-full object-cover object-center"/>
                                </div>
                                <div class="py-2 bg-gray-4 px-3 text-gray-dark rounded-r-2xl rounded-t-2xl inline-block">${autoMsg}</div>
                            </div>
                            <div class="font-16 text-gray-500 pt-1 ml-7 2xl:ml-10">${month[time.getMonth()]} ${time.getDate()}, ${time.toLocaleString('en-US', { hour: 'numeric', minute:'numeric', hour12: true })}</div>`
    setTimeout(()=>{
      space.append(autoMsgDIV)
      space.scrollTop = space.scrollHeight;
    },msgTime)
  }

  function getMsg(input,space){
   if(input.value.trim() != '' ){
    msgCount++
    let time = new Date()
    let DIV = document.createElement('div')
    DIV.className = 'w-auto max-w-[90%] mt-auto ml-auto'
    DIV.innerHTML = `<div class="flex items-end space-x-2 justify-end">
                        <div class="py-2 bg-secondary px-3 text-white rounded-l-2xl rounded-t-2xl inline-block">${input.value}</div>
                        <div class="shrink-0 size-[20px] 2xl:size-[30px]">
                            <img src="../src/images/avatar.jpg" class="w-full h-full rounded-full object-cover object-center"/>
                        </div>
                    </div>
                    <div class="font-16 text-gray-500 pt-1 mr-7 2xl:mr-10">${month[time.getMonth()]} ${time.getDate()}, ${time.toLocaleString('en-US', { hour: 'numeric', minute:'numeric', hour12: true })}</div>`
    space.append(DIV)
    input.value = ''
    space.scrollTop = space.scrollHeight;
    if(isAuto){
      isAuto = false
      autoMsgFun(autoMsg,1000,space)
    }

    if(msgCount == 3){
      autoMsgFun(autoMsg2,300,space)
    }
   }
  }

  function getImg(space){
    let multipleUploader = document.querySelector('.multiple-uploader')
    let imageContainer = multipleUploader.querySelectorAll('.image-container')
    let msgSpace = document.querySelector('.msg-space')
    let getTrue = false

    imageContainer.forEach(el=>{
      if(!el.querySelector('.exceeded-size')){
        getTrue = true
      }
    })

    if(getTrue){
      msgCount++
    }

    imageContainer.forEach(imgCon=>{
      if(!imgCon.querySelector('.exceeded-size')){
        let singleImg = imgCon.querySelector('.image-preview')
        let DIV = document.createElement('div')
        let time = new Date()
        DIV.className = 'w-auto max-w-[60%] mt-auto ml-auto'
        singleImg.classList.remove('image-preview')
        singleImg.classList.add( 'masseged-img','rounded-lg','cursor-pointer')
        let timeDiv = document.createElement('div')
        timeDiv.innerHTML = `<div class="font-16 text-gray-500 pt-1">${month[time.getMonth()]} ${time.getDate()}, ${time.toLocaleString('en-US', { hour: 'numeric', minute:'numeric', hour12: true })}</div>`
        DIV.append(singleImg,timeDiv)
        msgSpace.append(DIV)
        multipleUploader.innerHTML = additionAddMore
        space.scrollTop = space.scrollHeight;

        if(isAuto){
          isAuto = false
          autoMsgFun(autoMsg,1000,space)
        }
    
        if(msgCount == 3){
          autoMsgFun(autoMsg2,300,space)
        }

        // massegedImg()
      }
    })

  }

}