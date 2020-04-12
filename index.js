const fs = require('fs')
const rl = require('readline')

const jsonParseFile = (fileStr) => {
	return new Promise((resolve,reject) => {
		var lineReader = rl.createInterface({
		  input: fs.createReadStream(fileStr)
		});

		/*
			storing the result data
		*/
		let resData = {
			data: [],
			columns: 0,
			header: [],
			rows: 0
		}

		lineReader.on('line', function (line) {
				let lineSplit = line.split(',');
				if(resData.rows === 0){
					resData.rows = resData.rows + 1;
					resData.columns = lineSplit.length
					return;	
				}
				if(resData.rows === 1){
					console.log('csv Header')
					resData.header = lineSplit
				}
				resData.rows = resData.rows + 1;
				resData.data.push(lineSplit)
		});

		lineReader.on('close', () => {
			console.log('CLOSED');	
			resolve(resData)
		});
	})
}

const lessMatchingCols = (data, str, caseSensitive) => {
	let resArr = []
}

const filterColumnsByString = (nestedArr, str) => {
	
	//store array of arrays
	let resArr = []
	
	let columnIndexesToSkip = []
	nestedArr.forEach((dataRow, idx) => {
		//store filtered-row data
		let thisRowArr = []
		
		//looping through header
		if(idx === 0){
			dataRow.forEach((rowCell,cellIdx) => {
				
				//check if header-cell matches passed string
				let thisCellIsOk = !rowCell.includes(str)

				if(thisCellIsOk){
					thisRowArr.push(rowCell)
				}else{
					columnIndexesToSkip.push(cellIdx)
				}
			})

		// looping through data rows, NOT header
		}else{
			dataRow.forEach((rowCell,cellIdx) => {
				//assure this cell index is not cell to be skipped
				if(!columnIndexesToSkip.includes(cellIdx)){
					thisRowArr.push(rowCell)
				}
			})
		}

		//store row array in parent array
		resArr.push(thisRowArr)
	})
	
return resArr
}

jsonParseFile('./data/src.csv').then(fileData => {
	// console.log('---columns----')
	// console.log(fileData.columns)
	// console.log('----header----');
	// console.log(fileData.header)
	// console.log('rows')
	// console.log(fileData.rows)

	let filteredData = filterColumnsByString(fileData.data, 'Margin')
	let refiltered = filterColumnsByString(filteredData, 'UNRELATED')
	console.log('refiltered')
	console.log(refiltered)
	
})