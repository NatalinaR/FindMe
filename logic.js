// Start New Game
function newGame(difficulty) {
    // On selection of mode, create corresponding grids.
    switch (difficulty) {
        case 'easy':
            board = new Board(4, 4);
            break;
        case 'hard':
            board = new Board(6, 7);
            break;
        case 'reg':
        default:
            board = new Board(4, 6);
            break;
    }
    board.render();
    board.gameOver = false;

    $('.space').click(function (eventObject) {
        board.click(eventObject.target);
    });

    // var clickCount = 0;

    return board;
}

// Board Object
function Board(row, col){
    this.row = row;
    this.col = col;   
    this.spaces = [];    
    this.gameOver = false;
    this.spacesCleared = 0;
    this.bombCount = 0;
    this.clickCount = 0;
    this.clickPossible = 0;
    this.clickPossible2 = 0;


    this.click = function (target_elem) {
        var row = $(target_elem).attr("data-row");
        var col = $(target_elem).attr("data-col");

       
        // if (clickCount >= this.row*this.col / 2){
        //     $('#new-game').show();
        // }

        if (this.gameOver === true) {
            return;
        }

        if (this.spaces[row - 1][col - 1].explored == true) {
            return;
        }

        if (this.spaces[row - 1][col - 1].holds == -1) {
            this.explode(row - 1, col - 1);
        } else if (this.spaces[row - 1][col - 1].holds == 0) {
            this.clear(row - 1, col - 1);
            // uncoverSurroundings.call(this, row - 1, col - 1);
        } else {
            this.clear(row - 1, col - 1);
        }

        $('#value').html(this.clickPossible2);
    }

    this.render = function() {
        var spaces = "";
        for (i = 1; i <= row; i++) {
            for (j = 1; j <= col; j++) {
                spaces = spaces.concat('<div class="space" data-row="' + i + '" data-col="' + j + '">&nbsp;</div>');
            }
            spaces = spaces.concat('<br />');
        }
        $('#board').empty();
        $('#board').append(spaces);
    }




    //Initializing the Object

    if (this.spaces !== undefined) {
        this.spaces = new Array(this.row);

        for (i = 0; i < this.row; i++) {
            this.spaces[i] = new Array(this.col);
            for (j = 0; j < this.col; j++) {
                this.spaces[i][j] = new Space(false, 0);
            }
        }

        if(this.col >= 6) {
            var min = 2;   
        } else {
            var min = 1;
        }

        if(this.col > 6) {
            var max = 6;   
        } else {
            var max = 4;
        }


        this.bombCount = Math.round((Math.random() * ((max / 2) - min) + (min)));
        // this.bombCount = Math.round((Math.random() * (max - min + 1)) + min);
        
        if(this.bombCount <= 2 && this.col <=6) {
            this.clickPossible = this.bombCount * 5;
        } else {
            this.clickPossible = this.bombCount * 7;
        }
        
        this.clickPossible2 = this.clickPossible;

        $('#value').html(this.clickPossible2);

        // $('#value').html(this.bombCount);

        for (i = 0; i < this.bombCount; i++) {
            var bombIndex = Math.round(Math.random() * (this.row * this.col - 1));
            var x = Math.floor(bombIndex / this.col);
            var y = bombIndex % this.col;
            this.spaces[x][y] = new Space(false, -1);
        }

    }

    this.explode = function(row, col) {
        var dom_target = 'div[data-row="' + (row + 1) + '"][data-col="' + (col + 1) + '"]';
        $(dom_target).addClass('bomb');
        $(dom_target).html('<img src="pics/rabbit.png" alt="No pic">');
        this.spacesCleared++;   
        this.clickCount++; 
        this.clickPossible2--;

         checkAllCellsExplored.call(this);    
         checkTheClicks.call(this);

        // this.gameOver = true;
        }
    
        
    

    this.clear = function (row, col) {
        var dom_target = 'div[data-row="' + (row + 1) + '"][data-col="' + (col + 1) + '"]';
        $(dom_target).addClass('safe');
        if (this.spaces[row][col].holds > 0) {
            $(dom_target).text(this.spaces[row][col].holds);
        } 
        else {
            $(dom_target).html('<img src="pics/grass.png" alt="No pic">');
            this.clickCount++; 
            this.clickPossible2--;

        }
        checkAllCellsExplored.call(this);
        checkTheClicks.call(this);
        // this.spacesCleared++;
        this.spaces[row][col].explored = true;
    }

    function checkAllCellsExplored(){
        if (this.spacesCleared == this.bombCount) {
            this.gameOver = true;
            $('#new-game').show();
        }
    }

    function checkTheClicks() {
        if(this.clickCount == this.clickPossible && this.spacesCleared == 0) {
            this.gameOver = true;
            $('#new-game-lost').show();
        } else if (this.clickCount == this.clickPossible && this.spacesCleared < this.bombCount) {
            this.gameOver = true;
            $('#new-game-almost-lost').show();
        }
    }

}

//Space Object
function Space(explored, holds){
    this.explored = explored;
    this.holds = holds;
}
