var document = window.document;

function $ (id) {
	return document.getElementById(id);
}

function remove (array, element) {
	var index = array.indexOf(element);
	if (index == undefined) {
		console.log("'remove' function broken!!!!!!!!!!!!!");
		return;
	}
	array.splice(index, 1);
	return array;
}

//
//

$('solve_button').onclick = function () {
	var inputs = getInputs();
	var buckets = getBuckets(inputs);
	buckets = solve(buckets);
	//show answers;
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
	var rows = [],
	    row,
			i,
			j,
			input,
			cell = {};
	for ( i = 0; i < 9; i++) {
		row = [];
		for ( j = 0; j < 9; j++) {
			cell = {};
			input = inputs[ i*9 + j ] + '';
			cell.value = input;
			var fullMaybe = ['1','2','3','4','5','6','7','8','9'];
			if (cell.value == 0) {
				cell.maybe = fullMaybe;
			} else {
				cell.maybe = null;
			}
			row[j] = cell;
		}
		rows[i] = row;
	}
	var columns = [];
	for (var i = 0; i < 9; i++) {
		var column = []
		for (var j = 0; j < 9; j++) {
			column[j] = rows[j][i];
		}
		columns[i] = column;
	}
	var boxes = [];
	for ( i = 0; i < 9; i++ ) {
		var box = createBox(rows, i);
		boxes[i] = box;
	}
	var buckets = [rows, columns, boxes];
	return buckets;
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

function solve (buckets) {
	eliminatePossibilities(buckets);
	if ( isComplete(buckets) ) {
		console.log("solved!");
		showResults(buckets);
	} else {
		//solve(buckets);
		console.log("got stuck");
		showResults(buckets);
	}
}

function updateValue (cell, val, buckets) {
	cell.value = val;
	console.log("VALUE UPDATED!!!!!", val);
	cell.maybe = null;
	// update maybes of rest of cells
	for ( var h = 0; h < buckets.length; h++ ) {
		for ( var i = 0; i < buckets.length; i++ ) {
			for ( var j = 0; j < buckets.length; j++ ) {
				var holder = buckets[h][i][j];
				if ( holder.value == 0 ) {
					var temp = [];
					for ( p in cell.maybe ) {
						if ( p != val ) { temp[ temp.length ] = p }  }
					holder.maybe = temp;
				}
			}
		}
	}
	return buckets;
}

function eliminatePossibilities (buckets) {
	console.log("all buckets", buckets);
	var possibility_reductions = 0;
	for ( var h = 0; h < buckets.length; h++ ) { // for rows in buckets
		for ( var i = 0; i < buckets[h].length; i++ ) { // row in rows
			for ( var j = 0; j < buckets[h][i].length; j++ ) { // cell in row
				var cell = buckets[h][i][j];
				console.log(i, j, cell);
				if ( cell.value == 0 ) {
					var other_cells = remove(buckets[h][i], cell);
					var other_values = [];
					for ( var x = 0; x < other_cells.length; x++) {
						other_values[x] = other_cells[x].value; }
					var before = cell.maybe;
					var temp = [];
					for (p in cell.maybe) {
						if ( other_values.indexOf(p) == -1 )
							{ temp[ temp.length ] = p; }   }
					cell.maybe = temp;
					var after = cell.maybe;
					if ( cell.maybe.length == 1 ) 
						{ buckets = updateValue(cell, cell.maybe[0], buckets) }
					if ( before != after )
						{ possibility_reductions++; }
				}
			}
		}
	}
	if (possibility_reductions>0) { return eliminatePossibilities(buckets);
	} else { return buckets; }
}

function isComplete (buckets) {
	for ( var h = 0; h < buckets.length; h++ ) {
		for ( var i = 0; i < buckets[h].length; i++ ) {
			for ( var j = 0; j < buckets[h][i].length; j++ ) {
				var cell = buckets[h][i][j];
				if ( cell.value == 0 ) { return false; }
			}
		}
	}
	return true;
}

function showResults (buckets) {
	var rows = []
	for ( var i = 0; i < buckets[0].length; i++ ) {
		var row = [];
		for ( var j = 0; j < buckets[0][i].length; j++ ) {
			row[j] = buckets[0][i][j].value;
		}
		rows[i] = row;
	}
	console.log(rows);

}
