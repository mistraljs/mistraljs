# mistraljs
Mistraljs is an modified and improvement of the [Mustache templating language](http://mustache.github.io/) created by Chris Wanstrath.
Mistraljs is library use MVR-VM (Model View Route - ViewModel) Concept to help you create prototype. 

#MVR-VM Concept

A programming concept that combine MVVM with Routing System, that makes MVRVM really help to make a prototype. But for now, Mistraljs only in MVR development state.

#Installation 

This is how to install :
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="../release/mistral.js"></script>
```
Mistraljs use jquery to make it better. And this is base example using Mistraljs :
```
<!DOCTYPE html>
<html lang="">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>

</head>

<body>
    <div class="nav"></div>
    <div id="content"></div>
    <div class="nav"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="../release/mistral.js"></script>
    <script>
        var nav = {
            pathToTemplate: 'templates/nav.html',
            renderIn: '.nav',
            name: 'nav'
        };
        Mistral.configure({
            templates: [nav]
        });
        Mistral.route('/', 'base', [{
            pathToTemplate: 'templates/hello.html',
            renderIn: '#content',
            name: 'hello'
        }]);
        Mistral.route('/about', 'about', [{
            pathToTemplate: 'templates/about.html',
            renderIn: '#content',
            name: 'about'
        }]);
        Mistral.route('/newsfeed', 'newsfeed', [{
            pathToTemplate: 'templates/newsfeed.html',
            renderIn: '#content',
            name: 'newsfeed',
            data: {
                name: "Yoza Wiratama",
                newsfeed: [{
                    "content": "Moe"
                }, {
                    "content": "Larry"
                }, {
                    "content": "Curly"
                }]
            }
        }]);
        Mistral.routeOtherWise('/');

    </script>
</body>

</html>

```

#Route
In `router.js` we can init route code with this standard :
```
Mistral.route('/', 'routeName', [{
    pathToTemplate: 'template.html',
    renderIn: 'Where element by id template to render',
    name: 'templateName',
    onRendered: function () {
      //when template finish to render
    },
    onBefore: function () {
      //before load template and render it
    },
    onAfter : function(){
      // after render
    }
}]);
```
Example :
```
Mistral.route('/', 'home', [{
    pathToTemplate: 'home.html',
    renderIn: 'content',
    name: 'home'
}]);
```
Because templates using array of object (View Model), so we can render more templates in one route.
#Configure
If you want to use a default ViewModel in default template or layout for all routes you can configure it. :
```
var navbar = {
    pathToTemplate: 'navbar.html',
    renderIn: 'navbar',
    name: 'navbar'
}
Mst.configure({
    templates: [navbar]
});
```
`templates` using array of ViewModel, so we can add more templates in a layout, for example navbar and sidebar.




