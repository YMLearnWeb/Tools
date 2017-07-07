function moveModel(objs){
  this._objs = [].concat(objs);
  this._target = objs.target;
  this._neareastElemGot = new Event(this);
}

moveModel.prototype = {
  getPos:function(){
    for(var i=0;i<this._objs.length;i++){
      this._objs[i].x = this._objs[i].offsetTop;
      this._objs[i].y = this._objs[i].offsetLeft;
    }
  },
  getNear: function(){
    var referenceList = this._objs.splice(this._target,1);
    var dis_0 = 0, nearestElem;
    for(var i=0;i<referenceList.length;i++){
      var x1 = referenceList[i].x,x2 = referenceList[i].y,y1 = referenceList[i].x,y2 = referenceList[i].y;
      var dis = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
      if(dis < dis_0){
        dis_0 = dis;
        nearestElem = refereceList[i];
      }
    }
    this._neareastElemGot.notify(nearestElem);
  }
}

function moveView(elements,model){
  this._elements = elements;
  this._model = model;

  //bind model
  this._model._neareastElemGot.attach(function(){
    this.render();
  })
  //bind html
  this._moveElem = new Event(this);
  this._init = new Event(this);
  var _this = this;

  this._elements.moveElem.addEventListener('dragover',function(e){
    e.preventDefault();
    e.stopPropagation();
  })
  this._elements.moveElem.addEventListener('dragenter',function(e){
    e.preventDefault();
    e.stopPropagation();
  })
  this._elements.moveElem.addEventListener('drop',function(e){
    e.preventDefault();
    e.stopPropagation();
    _this._moveElem.notify(this);
  })
  document.addEventListener('loaded',function(e){
    var files = this.elements.files;
    _this._init.notify(files);
  })
}
moveView.prototype = {
  render:function(elem1, elem2){
    $(elem1).insertAfter($(elem2));
  }
}

function moveControl(model,view){
  this._model = model;
  this._view = view;
  this._view._moveElem.attach(function(){
    this.move();
  })
  this._view._init.attach(function(){
    this.load();
  })
}

moveControl.prototype = {
  move:function(){
    this._model.getNear();
  },
  load:function(){
    this._model.getPos();
  }
}

function start(){
   var view = new View({
     moveElem: $('#imageList').find('li')
   })
   var files = [];
   var filelist = $('#imageList').find('li');
   $.each(filelist,function(i,item){
     files.push(item);
   })
   var model = new Model(files);
   var movecontrol = new moveControl(model,view);
 }
