/**
 * Created by Giang on 2017-11-03.
 */


var STATUS = [
    "zero", "one", "two", "three", "four", "five", "six", "seven",
    "eight", "exploded", "wrong-flagged", "flagged", "closed", "mine"
]
var ACTION_TYPES = ["click", "double-click", "right-click"];
var game;
var id;
var socket;

function drawGameBoard(data) {
    game = data;

    $('table').remove();
    $('#board').append('<table>');

    /* loop through all items, check their states and apply css */
    for (var i = 0; i < game.board.length; i++) {
        var rowId = "row-" + i;
        $('table').append('<tr id="' + rowId + '">');

        for (var j = 0; j < game.board[i].length; j++) {
            var actions = '" onclick="onAction(this,0)" ondblclick="onAction(this,1)" oncontextmenu="onAction(this,2)"';
            var td = '<td x="' + i +'" y="' + j + '" class="' + STATUS[game.board[i][j]]
                + '" ' + (game.status == 0 ? actions : '') + '>';
            $('#' + rowId).append(td);
        }
    }
    /* disable right-click on table*/
    $("table").on("contextmenu", function () { return false; });

    if (game.status == 0){
        $("td").hover(function(e) {
            $(this).css("border", e.type === "mouseenter" ?
                "1px solid #ffffff" : "1px solid grey");
        });
    }

}

function onAction(element, type) {
    var x = $(element).attr("x");
    var y = $(element).attr("y");
    var value = game.board[x][y];
    if((type == 0 && value == 12) ||
        type == 1 && (value > 0 && value < 9) ||
        type == 2 && (value == 11 || value == 12)) {
        socket.emit('action', {id: id, action: ACTION_TYPES[type], x: x, y: y})
    }
}

$(document).ready(function() {

    id = $("#id").val();
    socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.emit('join', id);
    });

    socket.on('game-data', function(data) {
        drawGameBoard(data);
    });

    $(window).bind("beforeunload", function() {
        socket.disconnect();
    });
});