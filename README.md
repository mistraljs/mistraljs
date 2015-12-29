# mistraljs
Mistraljs is an modified and improvement of the [Mustache templating language](http://mustache.github.io/) created by Chris Wanstrath.
Mistraljs is library use MVR-VM (Model View Route - ViewModel) Concept to help you create prototype. 

#MVR-VM Concept

A programming concept that combine MVVM with Routing System, that makes MVRVM really help to make a prototype. But for now, Mistraljs only in MVR development state.

# Installation 

To support **open source community** mistraljs use 2 important dependecies, jquery and underscorejs.
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="../release/mistral.js"></script>
```
## NPM
```
npm install mistraljs
```
Mistraljs use jquery and underscore to make it better. And this is base example using Mistraljs :
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script src="../release/mistral.js"></script>
    <script>
        var nav = {
            pathToTemplate: 'templates/nav.html',
            renderIn: '.nav',
            name: 'nav'
        };
        Session.set("newsfeed", [{
            "content": "Moe"
        }, {
            "content": "Larry"
        }, {
            "content": "Curly"
        }]);
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
                newsfeed: Session.get("newsfeed")
            },
            onBefore : function(){
                console.log('before');
            }
        }]);
        Mistral.routeOtherWise('/');

    </script>
</body>

</html>


```

# Route
In `router.js` or `router script` we can init route code with this standard :
```
var nav = {
    pathToTemplate: 'templates/nav.html',
    renderIn: '.nav',
    name: 'nav'
};
Session.set("newsfeed", [{
    "content": "Moe"
}, {
    "content": "Larry"
}, {
    "content": "Curly"
}]);
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
        newsfeed: Session.get("newsfeed")
    },
    onBefore : function(){
        console.log('before');
    }
}]);
Mistral.routeOtherWise('/');
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
## route(path, routeName, templates)
## go(path)
## getRoute(path)
## getCurrentRoute()
## getRouteByName(name)
## routeOtherWise(route)
## refresh(templateName)

# Configure
If you want to use a default ViewModel in default template or layout for all routes you can configure it. :
```
var navbar = {
    pathToTemplate: 'navbar.html',
    renderIn: 'navbar',
    name: 'navbar'
}
Mistral.configure({
    templates: [nav]
});
```
`templates` using array of ViewModel, so we can add more templates in a layout, for example navbar and sidebar.

# Session
Session is a provider to store data or value on client globally. Store and also can refresh view or template automatically.
## set(name, value)
```
Session.set('activeId', 'TTdayoza76876adGQRA');
```
## setReactive(name, value, templateName)
setReactive method will provide us to refresh all templates or a template by name. Leave empty or undefined it will refresh all.
```
Session.setReactive('activeId', 'TTdayoza76876adGQRA'); // refresh all templates
Session.setReactive('activeId', 'TTdayoza76876adGQRA', 'nav'); // refresh template with name nav
```
## get(name)
```
var activeId = Session.get('activeId');
```
## equals(name, value)
```
if(Session.equals('activeId', 'TTdayoza76876adGQRA')) return true;
else return false;
```
# Collection
Collection is a connection between view and data, also like a table in database. For now collection only provides store data to localstorage easily.
Simple init :
```
var feeds = new Mistral.Collection('feed');
```
### Localstorage
```
var feeds = new Mistral.Collection('feed');
```
### insert(data)
Insert data to collection.
```
feeds.insert({content : 'cool'}); 
var newId = feeds.insert({content : 'cool'}); // "tto2Mt0iTVhi8hK4E4RoxzIAuqH"
```
### update(query, set)
```
feeds.update({id : 'tto2Mt0iTVhi8hK4E4RoxzIAuqH'}, {content : 'super cool'});
```
### find(query)
`find` will return array.
```
feeds.find({id : 'tto2Mt0iTVhi8hK4E4RoxzIAuqH'});
```
### findOne(query)
`findOne` will return first object.
```
feeds.findOne({id : 'tto2Mt0iTVhi8hK4E4RoxzIAuqH'});
```
### remove
```
feeds.remove({id : 'tto2Mt0iTVhi8hK4E4RoxzIAuqH'});
```
# Random (alpha)
Generate random string to make unique id or secret. 
## Random.id(length)
`Random.id` generated with datetime data, so it will really unique.
```
var id = Random.id(25);
console.log(id); // q0jxtLGNM2c771EuKt1uzzPmn
```
# License
The MIT License (MIT)
Copyright (c) 2015 by Yoza Wiratama

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


