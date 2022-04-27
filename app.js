"use strict";

const hand_y_offset = 100;
let card_inflight = null;
let card_shadow = null;
let card_offset_x = 0;
let card_offset_y = 0;


window.onload = function() {
	console.log("start");

	card_shadow = document.getElementById("shadow-card");

	hand_init();
	hand_arrange();
}


function hand_init() {

	let cards = document.querySelectorAll(".card");
	for(let card of cards) {
		if(typeof card.dataset.id !== "undefined") {
			card.style.backgroundImage = `url("cards/${card.dataset.id}.jpg")`;
		}
	}

	cards = document.querySelectorAll("#hand-area > .card");
	let i = 1;
	for(let card of cards) {
		card.dataset.num = i++;
		card.addEventListener("mousedown", handcard_onmousedown);
		card.addEventListener("mousemove", handcard_onmousemove);
	}

	card_shadow.addEventListener("mousedown", handcard_onmousedown);
	card_shadow.addEventListener("mousemove", handcard_onmousemove);
}


function hand_arrange() {

	const cx = 0;
	const cy = 0;
	const r = 10000;
	const to_rad = Math.PI / 180;
	let a1 = -5;
	let a2 = +5 +90;
	const offset = -hand_y_offset;

	const cards = document.querySelectorAll("#hand-area > .card");

	let i=1;
	for(let card of cards) {
		const rad1 = a1 * to_rad;
		const rad2 = a2 * to_rad;

		const x = Math.round( Math.cos(rad2) * r );
		const y = Math.round( Math.sin(rad2) * r );
		const sx = Math.round( r * Math.tan(rad1) );
		const dx = sx - x;
		const dy = r - y - offset;

		// console.log(`x: ${x} y: ${y} dx: ${dx} dy: ${dy}`);
		i++;

		card.style.transform = `translateY(${dy}px) rotate(${a1}deg)`;
		a1 += 10 / 5;
		a2 -= 10 / 5;
	}
}


function handcard_onmousedown(evt) {

	console.log("handcard_onmousedown");
	card_inflight = evt.currentTarget;

	card_offset_x = evt.offsetX;
	card_offset_y = evt.offsetY;

	const hand_area = document.getElementById("hand-area");

	// insert shadow card
	hand_area.insertBefore(card_shadow, card_inflight);

	// prevent slideup animtions
	hand_area.classList.remove("inspect");

	// move inflight card out of hand
	card_inflight.classList.add("inflight");
	document.body.append(card_inflight);

	// trigger recalc
	document_onmousemove(evt);
	hand_arrange();

	document.addEventListener("mousemove", document_onmousemove);
	hand_area.addEventListener("mouseup", handarea_onmouseup);

	document.getElementById("player-area").addEventListener("mouseup", playerarea_onmouseup);
	document.getElementById("encounter-area").addEventListener("mouseup", encounterarea_onmouseup);
}


function handarea_onmouseup(evt) {

	console.log("hand_onmouseup");

	// dropped back in hand
	const hand_area = document.getElementById("hand-area");

	// insert shadow card
	hand_area.insertBefore(card_inflight, card_shadow);

	// prevent slideup animtions
	hand_area.classList.add("inspect");

	card_inflight.classList.remove("inflight");
	document.getElementById("board").append(card_shadow);


	document_onmousemove(evt);
	hand_arrange();

	document.removeEventListener("mousemove", document_onmousemove);
	hand_area.removeEventListener("mouseup", handarea_onmouseup);

	document.getElementById("player-area").removeEventListener("mouseup", playerarea_onmouseup);
	document.getElementById("encounter-area").removeEventListener("mouseup", encounterarea_onmouseup);

	// card_inflight.removeEventListener("mousedown", handcard_onmousedown);
	// card_inflight.removeEventListener("mouseup", handcard_onmouseup);
	card_inflight = null;
}


function handcard_onmousemove(evt) {

	
	if(card_inflight === null) {
		evt.stopPropagation();
		return false;
	}

	console.log(`handcard_onmousemove ${evt.target.dataset.id}`);

	card_inflight.style.left = (evt.pageX - card_offset_x) + "px";
	card_inflight.style.top = (evt.pageY - card_offset_y) + "px";

	if(evt.target === card_shadow) {
		evt.stopPropagation();
		return false;
	}

	const width = evt.target.getBoundingClientRect().width;

	// left
	if(evt.offsetX < width / 2 && evt.offsetX + evt.movementX > width / 2 ) {
		document.getElementById("hand-area").insertBefore(card_shadow, evt.target.nextSibling);
	}
	// right
	else if(evt.offsetX > width / 2 && evt.offsetX + evt.movementX < width / 2 ){
		document.getElementById("hand-area").insertBefore(card_shadow, evt.target);
	}

	// recalc all angles
	hand_arrange();

	evt.stopPropagation();
	return false;
}


function document_onmousemove(evt) {

	// this is default in case the event is not picked by anything else
	if(card_inflight === null) return false;
	console.log("document_onmousemove");
	card_inflight.style.left = (evt.pageX - card_offset_x) + "px";
	card_inflight.style.top = (evt.pageY - card_offset_y) + "px";
}


function document_onmouseup(evt) {

	// this is default in case the event is not picked by anything else
	if(card_inflight === null) return false;
	console.log("document_onmouseup");
}


function playerarea_onmouseup(evt) {

	if(card_inflight === null) return false;
	console.log("playerarea_onmouseup");
}


function encounterarea_onmouseup(evt) {
	
	if(card_inflight === null) return false;
	console.log("encounterarea_onmouseup");
}