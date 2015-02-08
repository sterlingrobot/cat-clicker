var model = {
	isAdmin: false,
	currentCat: null,
	data: [
		{
			catID: 1,
			catName: 'Henry',
			imgUrl: 'images/henry.jpeg',
			clickCount: 0
		},
		{
			catID: 2,
			catName: 'Fluffy',
			imgUrl: 'images/fluffy.jpeg',
			clickCount: 0
		},
		{
			catID: 3,
			catName: 'Nikolai',
			imgUrl: 'images/nikolai.jpeg',
			clickCount: 0
		},
		{
			catID: 4,
			catName: 'Snowball',
			imgUrl: 'images/snowball.jpeg',
			clickCount: 0
		},
		{
			catID: 5,
			catName: 'Brimstone',
			imgUrl: 'images/brimstone.jpeg',
			clickCount: 0
		},

	],
    getAllCats: function() {
    	return this.data;
    }

};

var view = {
	$list: $('#view-list'),
	$detail: $('#view-detail'),
	$admin: $('#view-admin'),
	init: function() {
		var self = this,
			cats = controller.getAllCats();
		self.$list.empty();
		self.$list.append('<ul class="links-list"></ul>');
		cats.forEach(function(cat) {
			self.$list.find('ul').append('<li><a class="btn btn-large btn-default" href="#cat-' + cat.catID + '">' + cat.catName + '</a></li');
		});
	},
	showDetail: function() {
		var self = this,
			cat = controller.getCurrentCat();
		self.$detail.find('img').attr({ 'src': cat.imgUrl, 'data-catid': cat.catID });
		self.$detail.find('.badge').text(cat.clickCount).css('background-color', self.colorBadge(cat.clickCount));
		self.$detail.find('h2').text(cat.catName).css('color', self.colorBadge(cat.clickCount));
	},
	updateCount: function(newCount) {
		var self = this,
			cat = controller.getCurrentCat(),
			newCount = cat.clickCount,
			$badge = self.$detail.find('.badge');
		$badge.text(newCount).css('background-color', self.colorBadge(newCount));
		$badge.parent().find('h2').css('color', self.colorBadge(newCount));
	},
	colorBadge: function(count) {
		if(count > 20) return 'blue';
		if(count > 15) return 'green';
		if(count > 10) return 'orange';
		if(count > 5) return 'gold';
		return 'gray';
	},
	showAdmin: function() {
		var self = this,
			cat = controller.getCurrentCat(),
			$form = self.$admin.find('form');

		self.$admin.removeClass('hidden');
		$form.find('input').each(function() {
			var prop = $(this).attr('name');
			$(this).val(cat[prop]);
		});
	},
	hideAdmin: function() {
		var self = this;

		self.$admin.addClass('hidden');
	}
};

var controller = {
	init: function() {
		var self = this,
			target = document.location.hash,
			catID,
			cat;

		view.init();

		if(target.length > 0) {
			catID = parseInt(target.replace(/#cat-/, ''));
			cat = self.getCatByID(parseInt(catID));
		} else {
			cat = model.data[0];
		}
		model.currentCat = cat;
		view.showDetail();

		view.$list.on('click', 'a', function(e) {
			var id = parseInt($(this).attr('href').replace(/#cat-/, '')),
				cat = self.getCatByID(parseInt(id));

			model.currentCat = cat;
			view.showDetail();
			if(model.isAdmin) view.showAdmin();
			else view.hideAdmin();
		});

		view.$detail.on('click', 'img', function(e) {
			var cat = model.currentCat;

			cat.clickCount++;
			view.updateCount();
		});

		view.$detail.on('click', 'button', function(e) {
			model.isAdmin = true;
			view.$detail.find('button').hide();
			view.showAdmin();
		});

		view.$admin.on('submit', 'form', function(e) {
			var cat = model.currentCat;

			e.preventDefault();
			view.$admin.find('input').each(function() {
				var prop = $(this).attr('name'),
					val = $(this).val();
				cat[prop] = val;
			});

			view.init();
			model.isAdmin = false;
			view.hideAdmin();
			view.showDetail();
			view.$detail.find('button').show();
		});

		view.$admin.on('reset', 'form', function(e) {
			model.isAdmin = false;
			view.hideAdmin();
		});

	},
	getAllCats: function() {
		return model.getAllCats();
	},
	getCurrentCat: function() {
		return model.currentCat;
	},
	getCatByID: function(id) {
		var cats = model.getAllCats();
		for(var i=0; i<cats.length; i++) {
			if(cats[i].catID === id) return cats[i];
		}
		return false;
	}
}


controller.init();