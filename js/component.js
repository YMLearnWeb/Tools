var Events = require('./event.js');
var $ = require('jquery');

module.exports = Component;
var Component = (function(){
  function fileModel (){
    this._files = [];
    this.filesAdded = new Events.eventbus.Event(this);
  }

  fileModel.prototype = {
    addFiles: function(files){
      this._files = [];
      for(var i=0;i<files.length;i++){
        //add images
        if((/image/i).test(files[i].type)){
          this._files.push(files[i]);
        }
      }
      this.filesAdded.notify();
    },
    getImages:function(){
      return [].concat(this._files);
    }
  }

  function imageView (model,elements){
    this._model = model;
    this._elements = elements;
    this._files = "";

    this.dropBoxDropped = new Events.eventbus.Event(this);

    var _this = this;
    //attach model listeners;
    this._model.filesAdded.attach(function(){
      _this.build();
    })

  //attach listeners to HTML controls
    this._elements.dropBox.addEventListener('dragenter',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
    })

    this._elements.dropBox.addEventListener('dragover',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
    })

    this._elements.dropBox.addEventListener('drop',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      _this._files = ev.dataTransfer.files;
      _this.dropBoxDropped.notify(_this._files);
    })
  }

  imageView.prototype = {
    build:function(){
      var _this = this;
      var items = this._model.getImages();
      //create parent node
      var liNodes = [];
      for(var i in items){
        var node =  (_this._elements.template).cloneNode(true);
        var img = document.createElement("img");
        img.classList.add('index_'+i);
        img.classList.add('image-self')
        node.appendChild(img);
        // ulNode.appendChild(node)
        liNodes.push(node);
        /*
        * use dataUrl to display  thumbnail
        */
        var reader = new FileReader();
        reader.onload = (function(aImg,index){
          return function(e) {
            aImg.src = e.target.result;
          };
        })(img,i);
        reader.readAsDataURL(items[i]);
        /*
        *use objectUrl to display thumbnail
        */
        // img.src = window.URL.createObjectURL(items[i]);
        // img.height = 100;
        // img.onload = function(){
        //   window.URL.revokeObjectURL(this.src);
        // }
        // list.append(img);
      }

      //append node to the DOM
      var liNodeCount = liNodes.length;
      for(var j = 0; j<liNodeCount; j++){
        _this._elements.root.appendChild(liNodes[j]);
      }
    }
  }

  // Controller responds to user actions and invokes changes on the model
  function imageControl(model,view){
    this._model = model;
    this._view = view;
    var _this = this;
    this._view.dropBoxDropped.attach(function(){
      _this.add(_this._view._files);
    })
  }
  imageControl.prototype = {
    add:function(files){
        this._model.addFiles(files);
    }
  }

  $(function(){
    var model = new fileModel();
    var view = new imageView(model,{
      'dropBox': document.getElementById('dropBox'),
      'root': document.getElementById('imageList'),
      'template':document.querySelector('.imageWrapper')
    });
    var imagecontrol = new imageControl(model,view)
  })
})()
