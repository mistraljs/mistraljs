# mistraljs

mistraljs is library use MVRVM (Model View Route ViewModel) Concept to help you create prototype.

#MVRVM Concept

A programming concept that combine MVVM with Routing System, that makes MVRVM really help to make a prototype.

#Installation 

This is how to install :
```<script src="../mistral.js"></script>```
This is basic template use twitter bootstrap :
```
<!DOCTYPE html>
<html lang="">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mistral Js - Base Sample</title>
    <link rel="stylesheet" href="../assets/css/bootstrap.min.css" />
</head>

<body>
    <nav id="navbar" class="navbar navbar-default"></nav>
    <div id="content" class="container"></div>
    <script src="../assets/js/jquery-2.1.4.min.js"></script>
    <script src="../assets/js/bootstrap.min.js"></script>
    <script src="../mistral.js"></script>
    <script src="router.js"></script>
</body>

</html>
```

#Route
In `router.js` we can init route code with this standard :
```
Mst.route('/', 'routeName', [{
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
Mst.route('/', 'home', [{
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
    name: 'navbar',
    onRendered: onroutechanged,
    onRouteChanged: onroutechanged
}
Mst.configure({
    viewModels: [navbar]
});
```
`viewModels` using array of ViewModel, so we can add more templates in a layout, for example navbar and sidebar.



