const AMMOUNT_OF_NUMBERS = 4;

//Main()
$(function() {
    //Create the number elements and turn them into draggable elements
    var numbers = generateRandomNumbers(AMMOUNT_OF_NUMBERS, 1, 99);
    numbers.forEach((number) => {
        var newElement = createNumberElement(number);
        makeDraggable(newElement);
    });

    //Create the cell elements
    for (var i = 0; i < AMMOUNT_OF_NUMBERS; i++) {
        createCellElement();
    }
});

/* ----- ELEMENTS ----- */

//Create a number element
function createNumberElement(number) {
    return $('<div>').addClass('number').text(number).appendTo('#left');
}

//Create a cell element
function createCellElement() {
    $('<div>').addClass('cell').appendTo('#right').droppable({
        accept: '.number',
        drop: handleDropEvent
    });
}

//Generate a specified amount of unique random numbers within (min, max)
function generateRandomNumbers(n, min, max) {
    var numbers = [];
    while(numbers.length < n) {
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        if(numbers.indexOf(random) === -1) numbers.push(random);
    }
    return numbers;
}

//Make an element draggable
function makeDraggable(element) {
    element.draggable({
        revert: 'invalid',
        cursor: 'move',
        helper: 'clone',
        appendTo: 'body',
        containment: 'body',
        start: function(event, ui) {
            ui.helper.addClass('dragging');
        }
    });
}
/* ----- -------- ----- */

/* ----- LOGIC ----- */
//Drop event logic
function handleDropEvent(event, ui) {
    var droppedElement = ui.helper.clone().css({top: '', left: ''}).removeClass('ui-draggable-dragging').removeClass('dragging');
    ui.helper.remove();
    if ($(this).has('.number').length) {
        var swappedElement = $(this).children().first();
        swappedElement.detach().appendTo(ui.draggable.parent());
        makeDraggable(swappedElement);
    }
    $(this).append(droppedElement);
    ui.draggable.remove();
    makeDraggable(droppedElement);

    if (checkIfSorted()) {
        showSortedDialog();
    }
}

//Logic to check if the numbers are sorted
function checkIfSorted() {
    var cells = Array.from($('.cell'));
    var numbers = cells.map(cell => parseInt($(cell).text(), 10));
    return numbers.every((num, i) => i === 0 || num >= numbers[i - 1]);
}
/* ----- ----- ----- */

/* ----- VISUALS ----- */
//Show a dialog when all the numbers are sorted
function showSortedDialog() {
    $("#toast").dialog({
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 200
        },
        close: function(event, ui) {
            location.reload();
        }
    });

    $("#toast").dialog("open");

    $('.number').draggable('disable');
    $('.number').addClass('sorted no-hover');
}
/* ----- ------- ----- */