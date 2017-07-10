//document ready here:
$(document).ready(function(){
  console.log('jQuery sourced.');
  //calling the functions:
  refreshList();
  addClickHandlers();
});

//adding eventlisteners to the buttons:
function addClickHandlers() {
  console.log('Listeners added.');
  // Function called when the submit button is clicked
  $('#submitBtn').on('click', function(){
    console.log('Submit button clicked.');
    var todolist = {};
    todolist.task = $('#task').val();
    todolist.status = $('#status').val();
    addTask(todolist);
  }); //end of submitBtn

  // Function called when delete button is clicked:
  $('#viewTasks').on('click', '.deleteBtn', function(){
    var taskId = $(this).data('taskid');
    console.log($(this));
    console.log('Delete task with id of', taskId);
    if (!confirm("Do you really want to delete this?")){
      return false;
    }
    deleteTask(taskId);
  }); //end of deleteBtn

  //Function called when complete button is clicked:
  $('#viewTasks').on('click', '.completeBtn', function () {
    console.log('complete button clicked');
    var updateTask = {};
    updateTask.id = $(this).data('taskid');
    updateTask.status = $(this).data('complete');
    if (updateTask.status == "yes"){
      updateTask.status = "no";
    } else if (updateTask.status == "no") {
      updateTask.status = "yes";
    }
    console.log(updateTask);
    completeTask(updateTask);
  }); //end of completeBtn
} //end of addClickHandlers function

//Here is the AJAX request to post to server to add new task to database:
function addTask(taskToAdd) {
  $.ajax({
    type: 'POST',
    url: '/todos',
    data: taskToAdd,
    success: function(response) {
      console.log('Response from server.');
      refreshList();
    }
  });
} //end of addTask function

//Here is the AJAX request to get array from server:
function refreshList() {
  $.ajax({
    type: 'GET',
    url: '/todos',
    success: function(response) {
      console.log(response);
      appendToDom(response.tasks);
      $('#task').val('');
      $('#status').val('');
    }
  });
} //end of refreshList function

// Here is the AJAX request to the server to delete task from database:
function deleteTask(taskId) {

  $.ajax({
    type: 'DELETE',
    url: '/todos/' + taskId,
    success: function(response) {
      console.log(response);
      refreshList();
    }
  });
} //end of deleteTask function

//Here is the AJAX request to the server to update the status of a task:
function completeTask(updateTask) {

  $.ajax({
    url: '/todos',
    type: 'PUT',
    data: updateTask,
    success: function(response) {
      refreshList();
    }
  });
}

// Append array to the DOM
function appendToDom(taskList) {
  $('#viewTasks').empty();
  for(var i = 0; i < taskList.length; i += 1) {
    var list = taskList[i];
    $tr = $('<tr></tr>');
    $tr.data('list', list);
    $tr.append('<td>' + list.id + '</td>');
    $tr.append('<td>' + list.task + '</td>');
    $tr.append('<td>' + list.completionstatus + '</td>');
    $tr.append('<td><button class="completeBtn ' + list.completionstatus + '" data-taskid="' + list.id +
               '" data-complete="' + list.completionstatus + '">This task is now complete?</button></td>');
    $tr.append('<td><button class="deleteBtn" data-taskid="' + list.id + '">Delete</button></td>');
    $('#viewTasks').append($tr);
  }
} //end of appendToDom function
