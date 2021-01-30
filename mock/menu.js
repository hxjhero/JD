// 模拟数据
Mock.mock('/menu',{
    'dataSource|18':[{
        'key|+1':1,
        'titles|2-4':[{
            name: '@cword(2,4)',
            href: '@url("http")'
        }],
        'content':{
            'tabs|2-5':[{
                name:'@cword(2,5)',
                href:'@url'
            }],
            'subs|8-15':[{
                'activity|1':['','满300减40','199减100'],
                category:'@cword(2,3)',
                href:'@url',
                'items|8-20':[{
                    href:'@url',
                    name:'@cword(2,6)'
                }]
            }]
        }
    }]
});

//请求热门关键词
Mock.mock('/hotwords',{
    'result|8-15':[{
        word:'@cword(2,5)',
        href:'@url(http)'
    }]
});
//请求热门关键词第一个词
Mock.mock('/recommendWords',{
        text:'@cword(2,5)',
});

// 请求导航栏
Mock.mock('/navitems',{
    'result|10':[{
        word:'@cword(3,4)',
        href:'@url(http)'
    }]
})