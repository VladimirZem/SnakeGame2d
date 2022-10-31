let scoreBlock // Блок с счетом
let bestBlock  // Блок с лучшим счетом (открывается после смерти)
let deathBlock  // Блок смертей
let score = 0  // Кол-во очков
let bestScore = 0 //Кол-во лучших очков
let deathScore = 0  // кол-во смертей
let animationId = null // переменная для вызова анимации


const config = {  // настройки игры
    step: 0,   // Для пропуска игрового цикла
    maxStep: 6, // Для пропуска игрового цикла
    sizeCell: 16, // Размер одной ячейки  // В ТЗ к интер было 10 на 10, но как то мало было)) Могу поменять
    sizeBerry: 16/2 // размер ягоды
}

const snake = {  // Змейка
    x: 16,  // Кординаты по x
    y: 16,  // Кординаты по y
    dx: config.sizeCell, // Скорость по вертикали
    dy: 0, // Скорость по горизонтали
    tails: [], // Масив для змейки 
    maxTails: 3 // кол-во ячеек
}

let berry = {
    x: 0,
    y: 0 
}
// Переносим основные классы из HTMl сюды

let canvas = document.querySelector(".game__canvas");   // канвас
let canvasWrapper = document.querySelector(".canvas__wrapper") 
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game__score .score__count"); //счетчик в этой игре
bestBlock = document.querySelector(".best__game .best__score")      // счетчик за все время
deathBlock = document.querySelector(".death__game .death__score") // счетчик смертей

// Перед игрой отрысовываем блок со всеми очками (Кроме лучшего счет, он после смерти)
drawScore();
drawBestScore();
drawDeath();

/// Кнопки ///
let refreshBtn = document.querySelector(".refresh__game"), // кнопка перезагрузки
    startBtn = document.querySelector(".start__game"), // кнопка старт
    stopBtn = document.querySelector(".stop__game"), // кнопка стоп
    bestDisplay = document.querySelector(".best__game"), // блок с лучшим счетом
    musicPlay = document.querySelector(".music__game"), // кнопка музыка вкл
    musicStop = document.querySelector(".music__game__off") // кнопка музыка выкл
///       ///

/// Аудио ///
    const musicKalmar = new Audio('./audio/bumdom.mp3')  // Присваеваем константе musicKalmar новый аудио
    musicKalmar.volume = 0.1


    function screenMusic (vol) { // Делаем ползунок громкости
        let posMusic = document.querySelector(".range__numbers__music")
        posMusic.value = vol
        musicKalmar.volume = vol
    }
///      ///


// Функция с игровым циклом //
function gameLoop() {
    animationId = requestAnimationFrame (gameLoop);  // Делаем бесконечный вызов 
    if (++config.step < config.maxStep){
        return
    } 
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height) // С каждым кадром, очищаем канвас
    drawBerry()  // И заново отрисовываем
    drawSnake() // И заново отрисовываем
}
//             //


firstStart()




// Функция для отрисовки змейки //
function drawSnake(){
    snake.x += snake.dx // Меняем координаты змейки согласно скорости по x
    snake.y += snake.dy // Меняем координаты змейки согласно скорости  по y

    stopBorder()

    snake.tails.unshift( { x: snake.x, y: snake.y})  // Добавляем в начало массиве объект с х и у координатами   

    if ( snake.tails.length > snake.maxTails ){  // Если количество элементов у змейки больше, чем разрешено, то удаляем последний элемент
        snake.tails.pop()
    }

    snake.tails.forEach(function(el, index){  // Перебираем все элементы у змейки
        if ( index == 0){  // Если идекс строго равен нулю, то это голова и красим ее в нужным нам цвет
            context.fillStyle = "#FA0556"
        } else {            // Иначе тело в другой цвет
            context.fillStyle = "#A00034"
        }
        context.fillRect (el.x, el.y, config.sizeCell, config.sizeCell)  // Проверяем координаты ягоды и змейки 

        if ( el.x === berry.x && el.y === berry.y){ // Если они совпадают то увеличиваем хвост у змейки
            snake.maxTails++
            incScore()   // Добавляем очко
            highScore()  // Добавляем очко
            drawBestScore()  // Отрисовываем лучший счет и чтобы сохранился из прошлого раунда 
            randomPositionBerry() // Новую позицию для ягодки
        }
        for ( let i = index + 1; i < snake.tails.length; i++){  // Проверки коорд змейки и хвоста
            if (el.x == snake.tails[i].x && el.y == snake.tails[i].y){  // Если корды совпали, то перезагрузка игры
                refreshGame()
            }
        }
    })
}
//             //


// Функция, которая определяет столкнулась ли змейка с границами
function stopBorder() {
	if (snake.x < 0) {
		gameOver()
        stopGame()
        
	} else if ( snake.x >= canvas.width ) {
		gameOver()
        stopGame()
        
	}

	if (snake.y < 0) {
		gameOver()
        stopGame()
        
	} else if ( snake.y >= canvas.height ) {
		gameOver()
        stopGame()
        
	}
}
//             //



// Первая игра //


function firstStart(){      // Чтобы понять первая ли эта игра или нет, я решил, сделать через счетчик смертей
    if (deathScore == 0){                       // Если смертей строго 0     
        bestDisplay.style.display = "none"      // Тогда скрываем лучший счет
        canvas.classList.add("first__game")     // И включаем приветсвенный экран
    } else if (deathScore > 0){                 // Если больше нулю смертей, тогда 
        bestDisplay.style.display = "flex"      // Экран лучшего счет включаем
        canvas.classList.remove("first__game")  // Приветсвенный экран скриваем
    }
}
//             //



// Старт игры //

function startGames(){
    firstStart()
    startBtn.setAttribute("disabled", "")
    startBtn.removeEventListener("click",startGames)
    animationId = requestAnimationFrame (gameLoop)
    stopBtn.removeAttribute("disabled", "")
    canvasWrapper.classList.remove("gameover")
    canvas.classList.remove("first__game")
    drawSnake()
    
}
function startGame(){
    let start = this.getAttribute(".start__game")
}
//             //


//      Стоп игра       //
function stopGame(){
    cancelAnimationFrame(animationId)  // остановить анимацию
    context.clearRect(0, 0, canvas.width, canvas.height) // очистить канвас
    stopBtn.setAttribute("disabled", "") // кнопку стоп сделать недоступной
    startBtn.removeAttribute("disabled", "") // старт сделать доступной
    refreshGame()                             // перезагрузить игру
    startBtn.addEventListener("click", startGames )  
    gameOver()
    
}
//             //


// Экран после смерти //
function gameOver(){
    canvasWrapper.classList.add("gameover")
    
}
//             //


//     Перезагрузка игры        //
function refreshGame() {
	score = 0;   //Сброс счета
	drawScore();   // отрисовка счета
    deathScore++;   // к смерти +1
    drawDeath()     // отрисовка смерт
	snake.x = 160;  // сброс корд змейки по x
	snake.y = 160;  // сброс корд змейки по y
	snake.tails = [];   // Сброс тела
	snake.maxTails = 3;
	snake.dx = config.sizeCell; // сброс скорости
	snake.dy = 0;
    musicKalmar.pause()     // стоп музыка
    musicKalmar.currentTime = 0 // сброс музыки в начало
	randomPositionBerry();      // ягодку в рандом место
    startBtn.removeAttribute("disabled", "")    // старт сделать доступной
    canvasWrapper.classList.remove("gameover")  // скрыть экран смерти
}
//                                 //




// Все для ягодки //

function drawBerry() {  // Функция рисует ягоду
	context.beginPath();
	context.fillStyle = "#A00034"; // цвет
	context.arc( berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI ); // ресуем окружность на основе координат
	context.fill();
}

function randomPositionBerry() {  // Функция для рандомного разположения ягодки
    berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
	berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function getRandomInt(min,max){  // Сам рандом для ягодки
    return Math.floor(Math.random() * (max-min) + min );
}
//             //


// Счет

function incScore(){  // Обработка очков, увеличивая счетчик
    score++;
    drawScore()
}
function drawScore(){ // Отображение очков на странице
    scoreBlock.innerHTML = score;
}
//             //


// Лучший счет 

function highScore(){   // Функция, которая считает лучший счет
    if ( score >= bestScore){  // Если обычные очки больше лучшего счет, тогда лучший счет присваивает значение счета
        bestScore = score
    }
}

function drawBestScore(){ // Отображение очков на странице
    bestBlock.innerHTML = bestScore;
}
//             //



// Количество смертей //
function drawDeath(){ // Отображение кол-во смерти на странице
    deathBlock.innerHTML = deathScore;
}
//             //


// Функция для ползунка, который меняет ширину канваса //

function screenOp (wh) {
    let posScreen = document.querySelector(".range__numbers") // присвоим переменной posScreen значение класса из html
    posScreen.value = wh                                        // Присвоим нашей перемнной со значением из ползунка значение WH
    posScreen.style.left = wh - 20 + 'px'                       
    canvas.style.width = wh +'px'
}

//            //

// Управление //


document.addEventListener("keydown", function (e){
    if ( e.code == "KeyW"){                     // Кнопка вверх
        snake.dy = -config.sizeCell;
        snake.dx = 0;
    } else if (e.code == "KeyA"){               // Кнопка влево
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    } else if (e.code == "KeyS"){               // Кнопка вниз
        snake.dy = config.sizeCell;
        snake.dx = 0;
    } else if (e.code == "KeyD"){               // Кнопка вправо
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
})
//             //

// Слушатели //

refreshBtn.addEventListener("click", refreshGame)  // ждя перезагрузки

stopBtn.addEventListener("click", stopGame )  // стоп игры


startBtn.addEventListener("click", startGames ) // старт игры

musicPlay.addEventListener("click", function(){  // вкл музыку
    musicKalmar.play()
    musicPlay.style.display = "none"
    musicStop.style.display = "flex"
})
musicStop.addEventListener("click", function(){ // выкл музыку
    musicKalmar.pause()
    musicPlay.style.display = "flex"
    musicStop.style.display = "none"
})
//          //