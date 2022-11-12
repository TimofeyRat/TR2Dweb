var display = document.getElementById("display");
var context = display.getContext('2d');
display.style.left = "0px";
display.style.right = "0px";
display.style.position = "relative";
display.width = window.innerWidth;
display.height = window.innerHeight;
window.onscroll = () => { window.scroll(0, 0); }
document.body.style.overflow = "hidden";

var lastTime = Date.now();

var image = new Image();
image.onload = function() { startGame(); };
image.src = 'res/test.png';
var imageX = 0;
var imageY = 0;
var moveRight = true;

function startGame()
{
	main();
}

document.addEventListener("touchstart", trTouch);
document.addEventListener("touchmove", trTouch);

var click = null;

function trTouch(event)
{
	click = event.touches[0];
}

function update(deltaTime)
{
	if (click == null) return;
	imageX = click.pageX - image.width / 2;
	imageY = click.pageY - image.height / 2;
}

function render()
{
	context.clearRect(0, 0, display.width, display.height);
	context.drawImage(image, imageX, imageY);
}

function main()
{
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;
	
	update(dt);
	render();
	
	lastTime = now;
	requestAnimationFrame(main);
}