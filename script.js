const bodyTag = document.querySelector('body')
//контейнер для пятнашек 
const puzzleContainer = document.createElement('div');
//контейнер для настроек игры
const puzzleSettings = document.createElement('div');

//контейнер для кнопок
const gameButtonsContainer = document.createElement('div');
gameButtonsContainer.classList.add('puzzle__btns-container');
bodyTag.append(gameButtonsContainer);


//добавляем контейнер для пятнашек на старницу
puzzleContainer.classList.add('puzzle__container');
bodyTag.append(puzzleContainer)

//добавляемм контейнер для настроек игры
puzzleSettings.classList.add('puzzle__settings');
bodyTag.append(puzzleSettings)


let rows = 4;
let columns = 4;
let puzzleTileSize = 125;

let choseSizeLabel = '4x4';



//функция для вывода кнопок
function gameButtons() {

    const gameButtonsInfo = `<button id="btn-shuffle" class="btn--green puzzle__btn">Shuffle puzzles</button>
                            <p class="puzzle__text">Moves: <span id="puzzle-moves">5</span> </p>`

    gameButtonsContainer.innerHTML = gameButtonsInfo;

    const btnShuffle = document.getElementById('btn-shuffle');

    btnShuffle.addEventListener('click', function() {
        puzzleContainer.innerHTML = '';
        moves.innerText = 0;
        movesCounter = 0;
        gameLoad();
    });

    
 
}

gameButtons();



//функция для вывода настроек игры на страницу
function gameSettings() {
    

    const settingsInfo = `<p class="puzzle__text">Frame size: <span class="puzzle__size">${choseSizeLabel} </span> </p>
                          <p class="puzzle__text">Other sizes: 
                            <a class="puzzle__link"  id="size3x3">3x3</a> 
                            <a class="puzzle__link"  id="size4x4">4x4</a> 
                            <a class="puzzle__link"  id="size5x5">5x5</a> 
                            <a class="puzzle__link"  id="size6x6">6x6</a> 
                            <a class="puzzle__link"  id="size7x7">7x7</a> 
                            <a class="puzzle__link"  id="size8x8">8x8</a>
                            </p>`;

    puzzleSettings.innerHTML = settingsInfo;

    const allSizes = document.querySelectorAll('.puzzle__link');


    allSizes.forEach(function (size) {

        size.addEventListener('click', function () {

            let chosenSize = size.innerText.split('x');

            rows = chosenSize[0];
            columns = chosenSize[1];
            puzzleTileSize = 500 / rows;
            
            puzzleContainer.innerHTML = '';
            choseSizeLabel = size.innerText;
         
            moves.innerText = 0;
            movesCounter = 0;
            gameLoad();
        });
    });
}


let moves = document.getElementById('puzzle-moves');
    moves.innerText = 0;

    let movesCounter = 0;
    



window.onload = function () {
    
    gameLoad();
}


function gameLoad() {


    //массив рандомных чисел - выводим значения в зависимости от количества рядов и колон
    const numbers = [...Array(rows * columns - 1).keys()].map(el => el + 1).sort(() => Math.random() - 0.5);

    gameSettings();

    let number = 0;
    let randomEmptyY = getRandomInt(0, rows);
    let randomEmptyX = getRandomInt(0, columns);

    //выодим пятнашки на страницу   
    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < columns; c++) {

            const puzzleTile = document.createElement('div');

            //добавляем коорлинаты для каждой плитки
            puzzleTile.style.left = `${puzzleTileSize * c}px`;
            puzzleTile.style.top = `${puzzleTileSize * r}px`;

            //делаем рандомную пустую клетку
            //и добавляем сввойства пятнашкам
            if (r !== randomEmptyX || c !== randomEmptyY) {
                puzzleTile.innerText = numbers[number];
                puzzleTile.id = numbers[number];
                puzzleTile.classList.add('puzzle__tile');
                puzzleTile.style.width = `${puzzleTileSize}px`;
                puzzleTile.style.height = `${puzzleTileSize}px`;

                number++;
            } else {
                puzzleTile.id = 0;
                puzzleTile.classList.add('puzzle__tile--empty');

                puzzleTile.style.width = `${puzzleTileSize}px`;
                puzzleTile.style.height = `${puzzleTileSize}px`;
            }



            puzzleContainer.append(puzzleTile);

        }
    }


    //проверяем, находится ли рядом с обычной плиткой пустая
    const emptyBtn = document.querySelector('.puzzle__tile--empty');

    function moveBtn(btn) {
        let coordLeft = Math.floor(Math.abs((emptyBtn.style.left).slice(0, -2) - (btn.style.left).slice(0, -2)));
        let coordTop = Math.floor(Math.abs((emptyBtn.style.top).slice(0, -2) - (btn.style.top).slice(0, -2)));
        console.log(coordLeft, puzzleTileSize);

        //разница по одному из координат должна быть равна размеру плитки
        //проверяем координату слева
        if (coordLeft === Math.floor(puzzleTileSize) && coordTop === 0) {
            let containerTile = emptyBtn.style.left;
            emptyBtn.style.left = btn.style.left;
            btn.style.left = containerTile;

            moves.innerText = ++movesCounter;
        }

        //проверяем координату сверху
        if (coordTop === Math.floor(puzzleTileSize) && coordLeft === 0) {
            let containerTile = emptyBtn.style.top;
            emptyBtn.style.top = btn.style.top;
            btn.style.top = containerTile;
            moves.innerText = ++movesCounter;

        }
    }

    const btns = document.querySelectorAll('.puzzle__tile');


    btns.forEach(function (btn) {

        //для каждой плитки назначаем обработчик событий: проверям, можно ли сдвинуть плитку и не закончена ли игра
        btn.addEventListener('click', function () {
            moveBtn(btn);
            isSolved();
        });
    })



}

//проверяем решен ли пазл
//каждая плиточка должна иметь правильные координаты
function isSolved() {
    let counter = 1;

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < columns; c++) {

            if (counter === rows * columns) break;


            let tileLeft = +((tile.style.left).slice(0, -2));
            let tileTop = +((tile.style.top).slice(0, -2));

            if ((tileLeft !== puzzleTileSize * c) || (tileTop !== puzzleTileSize * r)) {
                return;
            }
            counter++;

        }
    }

    alert('Hooray! You solved the puzzle!');
}

//формула для вывода рандомного значения (для пустой плитки в начале игры)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}