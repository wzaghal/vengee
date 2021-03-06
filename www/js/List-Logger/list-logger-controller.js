'use strict';

angular.module('List-Logger-Controller',[])
.controller('ListLoggerController', function(Camera, Enemies, $state, $window) {
  var vm = this;
  angular.extend(vm,{
    selectRating: selectRating,
    ratingSelected: ratingSelected,
    getCalculatedAngerRating:getCalculatedAngerRating,
    setAngerRating: setAngerRating,
    addEnemy: addEnemy,
    isComedyHackWeekend: isComedyHackWeekend
  })

  vm.ratings = [false,false,false,false,false];
  vm.whereOptions = [
    {id:0, label: 'School'},
    {id:1, label: 'Work'},
    {id:2, label: 'Home'},
    {id:3, label: 'Your friend’s place'},
    {id:4, label: 'Outside'},
    {id:5, label: 'In Bed'},
    {id:6, label: 'The Gym'},
    {id:7, label: 'The Opera'},
    {id:8, label: 'At Oprah'},
    {id:9, label: 'The Theatre'},
    {id:10, label: 'Comedy Hack Weekend'}];

  vm.areaOfOffenceOptions = [
{id: 0, label: 'Physical'},
{id: 1, label: 'Mental'},
{id: 2, label: 'Romantic'},
{id: 3, label: 'Spiritual'},
{id: 4, label: 'Existential'},
{id: 5, label: 'Taste'},
{id: 6, label: 'Insulted my baby or beloved pet'},
{id: 7, label: 'All of Humanity'}];

vm.severityOptions = [
{id: 0, label: 'Dun fucked up and it’s time to pay.'},
{id: 1, label: 'True blue piece of shit needs a lesson.'},
{id: 2, label: 'That fucking piece of shit has really got this coming.'},
{id: 3, label: 'Fuck me? No no no my friend, FUCK YOU, you garbage bag full of wasted organs.'},
{id: 4, label: 'I CONJURE A DARK RITUAL TO LIVE FOREVER IN TORMENT TO HAUNT YOUR CHILDREN’S CHILDREN’S CHILDREN'}];

function setup(){
  initEnemy();
  vm.getPhoto();
}

function initEnemy(){
    vm.enemy = {
    where: vm.whereOptions[0],
    areaOfOffence: vm.areaOfOffenceOptions[0],
    severity: vm.severityOptions[0]
  };
  selectRating(0);
}

  function isComedyHackWeekend() {
    if (vm.enemy.where.id === 10) {
      vm.severityOptions.push({id: 5, label: 'Zoe Daniels'});

    }

  }

  function selectRating(numIndex) {
    for (var i = 0 ; i < vm.ratings.length ; i++){
      if (i <= numIndex){
        vm.ratings[i] = true;
      }else{
        vm.ratings[i] = false;
      }

    }

  }

  function setAngerRating() {
    var id = vm.enemy.severity.id;
    if (id >= 5) {
      // vm.ratings = [true, true, true, true, true, true, true, true, true , true];
      vm.maxAnger = true;
    }
    selectRating(vm.enemy.severity.id);
  }

  function getCalculatedAngerRating() {
    var allWords = vm.enemy.severity.label.split(' ');
    var swearWords = numOfSwearWords(allWords);
    var angerPercentage = swearWords.length/ allWords.length * 100;
    calculateAngerRating(angerPercentage);
  }

  function calculateAngerRating(angerPercentage) {

    if (angerPercentage > 80) {
      selectRating(5);
    }
    else if (angerPercentage > 60){
      selectRating(4);
    }
    else if (angerPercentage > 40){
      selectRating(3)
    }
    else if (angerPercentage > 20){
      selectRating(2)
    }
    else if (angerPercentage > 0) {
      selectRating(1);
    }

  }

  function numOfSwearWords(words){
   return  words.filter(function(word){
      return isSwearWord(word);
    });

  }

  function addEnemy() {

    vm.enemy.ratingArray = vm.ratings.filter(function(rating){
      return rating;
    });
    vm.enemy.rating = vm.enemy.ratingArray.length;

    if (vm.maxAnger){
      vm.enemy.ratingArray.push(6);
      vm.enemy.rating = 6;

    }
    Enemies.add(vm.enemy);
    $state.go('tab.enemies');
  }

  function isSwearWord(word) {
    var swearWords = ['ass',
    'dick',
    'fuck',
    'piece',
    'of',
    'shit',
    'douchebag',
    'bitch',
    'whore',
    'sob'];

    var hasSwearWord = swearWords.map(function(swearWord){
      return word.indexOf(swearWord) !== -1;
    })
    .filter(function(isSwearWord){
      return isSwearWord === true;
    });

    return hasSwearWord.length > 0;
  }

  function ratingSelected(num) {
    var classes = '';
    if (vm.maxAnger) {
      classes+= 'rating--max-rating ';
    }
    if (vm.ratings[num]){
      classes+= 'rating--selected';
    }
    else{
      classes+= 'rating--unselected';
    }

    return classes;
  }

  vm.getPhoto = function() {
    if ($window.cordova) {
      Camera.getPicture().then(function(imageURI) {
        console.log(imageURI);
        vm.enemy.img = imageURI;
      }, function(err) {
        console.err(err);
      });
    }else {
      vm.isWeb = true;

    }
  };

  setup();

});
