var events = require('./event.js');
var $ = require('jquery');

var Move = function () {
	function moveModel(objs) {
		this._objs = [].concat(objs);
		this._nearestElemGot = new events.Events(this);
	}

	moveModel.prototype = {
		getPos: function () {
			for (var i = 0; i < this._objs.length; i++) {
				this._objs[i].x = this._objs[i].offsetTop;
				this._objs[i].y = this._objs[i].offsetLeft;
			}
		},
		getNear: function (target) {
			var referenceList = this._objs.splice(target, 1);
			var dis_0 = 0,
				nearestElem;
			for (var i = 0; i < referenceList.length; i++) {
				var x1 = referenceList[i].x,
					x2 = referenceList[i].y,
					y1 = referenceList[i].x,
					y2 = referenceList[i].y;
				var dis = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
				if (dis < dis_0) {
					dis_0 = dis;
					nearestElem = refereceList[i];
				}
			}
			this._neareastElemGot.notify(nearestElem);
		}
	};

	function moveView(model, elements) {
		this._elements = elements;
		this._model = model;

		//bind model
		this._model._nearestElemGot.attach(function () {
			this.render();
		});
		//bind html
		this._moveElem = new events.Events(this);
		this._init = new events.Events(this);
		var _this = this;

		this._elements.moveElem.on('dragover', function (e) {
			e.preventDefault();
			e.stopPropagation();
		});
		this._elements.moveElem.on('dragenter', function (e) {
			e.preventDefault();
			e.stopPropagation();
		});
		this._elements.moveElem.on('drop', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_this._moveElem.notify(e.currentTarget);
		});
		document.addEventListener('loaded', function (e) {
			var files = this.elements.files;
			_this._init.notify(files);
		});
	}
	moveView.prototype = {
		render: function (elem1,
		elem2) {
			$(elem1).insertAfter($(elem2));
		}
	};

	function moveControl(model, view) {
		this._model = model;
		this._view = view;
		var _this = this;
		this._view._moveElem.attach(function () {
			_this.move();
		});
		this._view._init.attach(function () {
			_this.load();
		});
	}

	moveControl.prototype = {
		move: function (args) {
			this._model.getNear(args);
		},
		load: function () {
			this._model.getPos();
		}
	};

	function Excute(node) {
		console.log('move.js');
		var files = [];
		var filelist = $('#imageList').find('li');
		$.each(filelist, function (i,
		item) {
			item.target = item.Id;
			files.push(item);
		});
		var model = new moveModel();
		var view = new moveView(model, {
			moveElem: $('#imageList li')
		});

		var movecontrol = new moveControl(model, view);
	}
	// function start(){
	//    var view = new View({
	//      moveElem: $('#imageList').find('li')
	//    })
	//    var files = [];
	//    var filelist = $('#imageList').find('li');
	//    $.each(filelist,function(i,item){
	//      files.push(item);
	//    })
	//    var model = new Model(files);
	//    var movecontrol = new moveControl(model,view);
	//  }
	return {
		excute: Excute
	};
}

module.exports.Move = Move;
