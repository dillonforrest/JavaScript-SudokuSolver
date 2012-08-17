var document = window.document;

function $ (id) {
	return document.getElementById(id);
}

function remove (array, element) {
	var index = array.indexOf(element);
	array.splice(index, 1);
	return array;
}

//
//

$('solve_button').onclick = function () {
	var inputs = getInputs();
	//console.log(inputs);
	var buckets = getBuckets(inputs);
}

function getInputs () {
	var bucket = $('sudoku_table').getElementsByTagName('tr');
	var inputs = []
	for (var i = 0; i < bucket.length; i++) {
		var container = bucket[i].getElementsByTagName('td');
		for (var j = 0; j < container.length; j++) {
			var input = container[j].firstChild.value;
			input = input ? Number(input) : 0;
			inputs[ i*9 + j ] = input;
		}
	}
	return inputs;
}

function getBuckets (inputs) {
	var rows = [];
	for (var i = 0; i < 9; i++) {
		var row = [];
		for (var j = 0; j < 9; j++) {
			var cell = {};
			cell.value = inputs[ i*9 + j ];
			fullMaybe = [1,2,3,4,5,6,7,8,9];
			if ( cell.value === 0 ) {
				cell.maybe = fullMaybe;
			} else {
				cell.maybe = remove(fullMaybe, cell.value);
			}
			row[j] = cell;
		}
		rows[i] = row;
	}
	var columns = []
	for (var i = 0; i < 9; i++) {
		var column = []
		for (var j = 0; j < 9; j++) {
			column[j] = rows[j][i];
		}
		columns[i] = column;
	}
	var boxes = []
	for (var i = 0; i < 9; i++) {
		var box = createBox(rows, i);
		boxes[i] = box;
	}
	console.log(boxes);
}

function createBox (rows, i) {
	var m, n;
	if ( 0 <= i && i <= 2 ) {
		m = 0;
	} else if ( 3 <= i && i <= 5 ) {
		m = 3;
	} else if ( 6 <= i && i <= 8) {
		m = 6;
	}
	if ( i % 3 == 0 ) {
		n = 0;
	} else if ( i % 3 == 1 ) {
		n = 3;
	} else if ( i % 3 == 2 ) {
		n = 6;
	}
	var part1 = rows[ 0+m ].slice( 0+n, 3+n );
	var part2 = rows[ 1+m ].slice( 0+n, 3+n );
	var part3 = rows[ 2+m ].slice( 0+n, 3+n );
	var box = part1.concat(part2).concat(part3);
	return box;
}
