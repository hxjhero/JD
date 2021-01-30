(function(){
    //轮播图插件

// 轮播图需求分析
// 1.轮播图的位置不同 （可想到的方案有：将位置传入插件中 或者通过jq选择器选中这个位置）
// 2.轮播图的内容不同（传递的内容应该是一个结构div/dom的列表）
// 3.大小不同 width height
// 4.动画方式不同 type:fade | animate
// 5.是否自动轮播
// 6.是否有小圆点
// 7.左右按钮显示形态（一直显示，鼠标移入显示，一直不显示）
// 8.切换的时间间隔

/**
 * 
 * @param {Object} options 
 *          content: $('.item'), 轮播图的内容
            width: 500, 轮播内容的宽度
            height: 400,轮播内容的高度
            type: 'fade',动画方式
            isAuto: true,是否自动轮播
            showSpots:true,是否有小圆点
            showChangeBtn: 'always',左右按钮显示的形态
            autoChangeTime: 3000 切换的时间间隔
            spotsPosition:小圆点的位置

 *  @param{selector} wrap 插入轮播图的区域
 */
function Swiper(options, wrap) {
    this.content = options.content || [];
    // 当前轮播图片的个数
    this.len = this.content.length;
    this.width = options.width || wrap.width();
    this.height = options.height || wrap.height();
    this.type = options.type || 'fade';
    this.isAuto = options.isAuto === undefined ? true : options.isAuto;
    this.showSpots = options.showSpots === undefined ? true : options.showSpots;
    this.showChangeBtn = options.showChangeBtn || 'always';
    this.autoChangeTime = options.autoChangeTime || 5000;
    this.wrap = wrap;
    this.spotsPosition = options.spotsPosition || 'left';
    // 当前要显示的图片索引值
    this.currentIndex = 0;
    // 判断当前动画是否完成
    this.lock = true;
    // 自动轮播定时器
    this.timer = null;

}

// 创建轮播图结构
Swiper.prototype.createDom = function () {
    var swiperWrapper = $('<div class="my-swiper"></div>');
    var swiperContent = $('<ul class="my-swiper-content"></ul>');
    var leftBtn = $('<div class="my-swiper-btn my-swiper-lbtn">&#xe667;</div>');
    var rightBtn = $('<div class="my-swiper-btn my-swiper-rbtn">&#xe601;</div>');
    var spotsWrapper = $('<div class="my-swiper-spots"></div>');
    for (var i = 0; i < this.len; i++) {
        $('<li></li>').html(this.content[i]).appendTo(swiperContent);
        $('<span class="my-swiper-spot"></span>').appendTo(spotsWrapper);
    }
    if (this.type === 'animate') {
        $('<li></li>').html($(this.content[0]).clone(true)).appendTo(swiperContent);
    }
    spotsWrapper.css({
        textAlign: this.spotsPosition
    })
    $(swiperWrapper).append(swiperContent)
        .append(leftBtn)
        .append(rightBtn)
        .append(spotsWrapper)
        .appendTo(this.wrap)
        .addClass('my-swiper-' + this.type);
}

// 动态设置样式
Swiper.prototype.initStyle = function () {
    $(this.wrap).find('.my-swiper').css({
        width: this.width,
        height: this.height
    })
    // 从左到右轮播需要站在一排
    if (this.type === 'animate') {
        $(this.wrap).find('.my-swiper .my-swiper-content')
            .css({
                width: (this.len + 1) * this.width
            });
    } else {
        // 淡入淡出fade
        // 找到当前轮播图的内容 将其全部隐藏并将当前展示的区域显示出来
        $(this.wrap).find('.my-swiper-content li').hide().eq(this.currentIndex).show();
    }
    // 给小圆点添加默认选中
    $(this.wrap).find('.my-swiper-spots .my-swiper-spot').eq(this.currentIndex).addClass('spot-active');

    // 为不同状态的左右按钮添加样式
    if (this.showChangeBtn === 'always') {
        $(this.wrap).find('.my-swiper-btn').show();
    } else if (this.showChangeBtn === 'hide') {
        $(this.wrap).find('.my-swiper-btn').hide();
    } else {
        $(this.wrap).find('.my-swiper-btn').hide();
        // $(this.wrap).mouseenter(function(){
        //     $(this).find('.my-swiper-btn').fadeIn();
        // }).mouseleave(function(){
        //     $(this).find('.my-swiper-btn').fadeOut();
        // })
        //如果显示状态是hover 则移入的时候展示
        $(this.wrap).hover(function () {
            $(this).find('.my-swiper-btn').fadeIn();
        }, function () {
            $(this).find('.my-swiper-btn').fadeOut();
        })

    }

    // 小圆点是否显示
    if (!this.showSpots) {
        $(this.wrap).find('.my-swiper-spots').hide();
    }
};

// 轮播图区域的行为绑定
Swiper.prototype.bindEvent = function () {
    // 保存当前的实例对象
    var self = this;
    $(this.wrap).find('.my-swiper-lbtn').click(function () {
        //如果当前动画没有完成 那么不进行下面的动画效果
        if (!self.lock) {
            return false;
        }
        self.lock = false;
        // console.log(self.currentIndex);
        if (self.currentIndex === 0) {
            if (self.type === 'animate') {
                $(self.wrap).find('.my-swiper .my-swiper-content').css({
                    left: - self.len * self.width,
                });
            }
            self.currentIndex = self.len - 1;
        } else {
            self.currentIndex--;
        }
        self.change();

    }).end().find('.my-swiper-rbtn').click(function () {
        //如果当前动画没有完成 那么不进行下面的动画效果
        if (!self.lock) {
            return false;
        }
        self.lock = false;
        // 淡入淡出效果的轮播 判断当前图片是不是最后一张图片 如果是的话那么下一次轮播的图片索引值将为0
        if (self.type === 'fade' && self.currentIndex === self.len - 1) {
            self.currentIndex = 0;
            // 从左到右的轮播 判断当前图片是不是后面的第一张图片 如果是的话 那么让当前的轮播图瞬间变化到前面的轮播图的位置 继续轮播

        } else if (self.type === 'animate' && self.currentIndex === self.len) {
            $(self.wrap).find('.my-swiper .my-swiper-content').css({
                left: 0,
            });
            // 接下来要轮播图片的索引值
            self.currentIndex = 1;
        } else {
            self.currentIndex++;
        }
        self.change();
    })
    $(this.wrap).find('.my-swiper-spots span').mouseenter(function () {
        self.currentIndex = $(this).index();
        self.change();
    })
        //回退到上级this.wrap对象
        .end()
        // 当鼠标移入到轮播图区域的时候清除自动轮播
        .mouseenter(function () {
            clearInterval(self.timer);
        })
        // 鼠标移出轮播图区域时判断是否自动轮播
        .mouseleave(function () {
            if (self.isAuto) {
                self.autoChange();
            }
        });

}
// 切换效果功能
Swiper.prototype.change = function () {
    var self = this;
    //淡入淡出效果动画
    if (this.type === 'fade') {
        $(this.wrap).find('.my-swiper-content li').fadeOut().eq(this.currentIndex).fadeIn(function () {
            //当前动画已经完成
            self.lock = true;
        });
    } else {
        // 从左到右轮播效果动画
        $(this.wrap).find('.my-swiper-content').animate({
            left: - this.currentIndex * this.width
        }, function () {
            //当前动画已经完成
            self.lock = true;
        });
    }
    //小圆点的切换
    $(this.wrap).find('.my-swiper-spots .my-swiper-spot').removeClass('spot-active').eq(this.currentIndex).addClass('spot-active');
}

Swiper.prototype.init = function () {
    this.createDom();
    this.initStyle();
    this.bindEvent();
    if (this.isAuto) {
        this.autoChange();
    }
}
//自动轮播效果
Swiper.prototype.autoChange = function () {
    var self = this;
    this.timer = setInterval(function () {
        $(self.wrap).find('.my-swiper-lbtn').trigger('click');
    }, this.autoChangeTime)
}
$.fn.extend({
    swiper: function (options) {
        var obj = new Swiper(options, this);
        obj.init();
    }
})

}())