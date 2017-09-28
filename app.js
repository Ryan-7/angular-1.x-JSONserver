var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('mainController', ['$scope', '$filter', '$http', 'nameService', function($scope, $filter, $http, nameService) {
    
                                    
   
    
    $scope.someName = nameService.name;
    
    $scope.userName = nameService.userName;
    
    $scope.pageName = "Page 1"
    $scope.someVar = '';
    
    $scope.nameChange = "Ryan";
    $scope.characters = 5;

    $scope.lowercasehandle = function() {
        return $filter('lowercase')($scope.someVar);                          
    }
    
    setTimeout(function(){
//        $.scope.$apply(function() {
//            // any code you put in here, will tell Angular to run its normal process of the event watch list and digest loop 
//        })
        $scope.nameChange = "Bob"
        console.log($scope.nameChange);
    }, 1000)
    
    $scope.characters = 5;

    $scope.returnBoolean = function() {
        return true;
    }
    
    $scope.classVar = {
        'alert-warning': true
    }
    
    $scope.rules = [
        { rulename: "Must be 5 characters" },
        { rulename: "Must not be used elsewhere" },
        { rulename: "Must be cool" }
    ]
    
    $scope.alertClick = function() {
        alert("Hello")
    }
    
    
    // Just wrapping the XMLHttpRequest Object, making it easier to use. 
    
    $http.get('https://jsonplaceholder.typicode.com/users')
        .success(function(res) {
            $scope.currentUsers = res;
            console.log($scope.currentUsers);
        })
        .error(function(data, status) {
            console.log(data, status)
        })
    
    
    
    $http.get('http://localhost:3000/posts')
        .success(function(res) {
            console.log(res);
    })
    
    // So this must be how forums work, you make a post request, it's saved to the database
    // then it's retrieved and outputted on a page 
    

    $scope.addUser = function() {
        console.log($scope.username)
        $http.post('http://localhost:3000/posts', { "id": null, "title": "json-server", "author": $scope.userName } )
            .success(function(res) {
                console.log('response from post')
                console.log(res); // Ideally I'd set the response to the user list var, but the res is only the data we sent to server. 
        })
        
        $http.get('http://localhost:3000/posts')
            .success(function(res) {
                $scope.usersInDatabase = res;
        })
    }
    
}]);

myApp.config(function ($routeProvider) { // Inject route provider into the Angular configuration
    $routeProvider
    .when('/first-page', {
        templateUrl: 'pages/first-page.html',  // physical location of a template, will output in ng-view (aka router-outlet in NG2)
        controller: 'mainController' // bound to the scope of this controller, just like in Angular 2 is to the TypeScript component 
    })
    .when('/second-page', {
        templateUrl: 'pages/second-page.html',
        controller: 'otherController'
        
    })
})

myApp.controller('otherController', ['$scope', '$location', '$log', function($scope, $location, $log) {
    
    $log.info($location.path()); // Angular already has a service to grab the hash, which it uses in its $routeProvider
    
    $scope.pageName = "Page 2";
    
}]);


// Create our own custom service

myApp.service('nameService', function() {
    let songId; // get the song id from URL parameter, concatenate with the api calls.
    var self = this;
    this.userName = "username";

})


myApp.controller('songController', ['$scope', '$http', function($scope, $http) {
    
    $scope.songs;
    $scope.currentSong;
    $scope.currentSongUnsaved; 
    $scope.editMode = false;
    
    
    this.getSongs = () => {
        $http.get('http://localhost:3000/songs')
            .success(function(res) {
                $scope.songs = res;
        })
    }
    this.getSongs();

    
    $scope.viewSong = (index) => {
        console.log(index)
        $scope.currentSong = $scope.songs[index];

    }
    
    $scope.deleteSong = (songId) => {
        $http.delete('http://localhost:3000/songs/' + songId)
            .success((res) => {
                console.log('song deleted')
                this.getSongs();
                $scope.currentSong = null;
        })
    }
    
    $scope.editSong = (songId) => {
        $scope.editMode = true;
        $scope.currentSongUnsaved = Object.assign({}, $scope.currentSong);
        console.log($scope.currentSongUnsaved)
    }
    
    $scope.cancelEdit = () => {
        console.log($scope.currentSongUnsaved)
        // need that watch method 
        $scope.$watch('$scope.currentSong', () => {
            $scope.currentSong = Object.assign({}, $scope.currentSongUnsaved); 
        })
        
        console.log($scope.currentSong)
        $scope.editMode = false;
        // watch apply for the currentSong variable ...?
    }
}])

myApp.controller('commentController', ['$scope', 'commentService', '$http', function($scope, commentService, $http) {
    $scope.comments;
    $scope.commentBox = '';
    
    this.getComments = () => {
        $http.get('http://localhost:3000/comments')
            .success(function(res) {
                $scope.comments = res;
        })
    }
    
    $scope.addComment = () => {
        $http.post('http://localhost:3000/comments', { "id": null, "body": $scope.commentBox, "timeStamp": new Date(), "author": 'Ryan'  } )
            .success((res) => {
                console.log('New Comment Added')
                this.getComments();
                $scope.commentBox = '';
        })
    }
    
    $scope.deleteComment = (commentId) => {
        $http.delete('http://localhost:3000/comments/' + commentId)
            .success((res) => {
                this.getComments();
        })
    }
    
    this.getComments();
    
        
}]);

myApp.service('commentService', ['$http', function($http) {
    this.addComment = function(body) {
        return new Promise(function(resolve, reject){
            $http.post('http://localhost:3000/comments', { "id": null, "body": body, "timeStamp": new Date(), "author": 'Ryan'  })
                .success(function(res) {
                    resolve(res)
                })
        })
    }
    
    this.getComments = $http.get('http://localhost:3000/comments');

}])



