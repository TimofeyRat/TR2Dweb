var test = document.createElement("div");
var x = 100;
var y = 100;
test.style.left = x + "px";
test.style.top = x + "px";
test.style.width = "50px";
test.style.height = "50px";
test.style.background = "red";
test.style.position = "relative";

document.body.appendChild(test)

document.addEventListener("touchstart", trTouch);
document.addEventListener("touchmove", trTouch);

function trTouch(event)
{
	var click=event.touches[0];
	x = click.pageX - 25;
	y = click.pageY - 25;
	test.style.left = x + "px";
	test.style.top = y + "px";
}