import './board.css';

export default class Board {
    constructor(htmlElement) {
        this.containerHtml = htmlElement;
        this.drawTable();
        this.colorDictionary = this.getColorDictionary();
        this.init();
        document.onkeydown = (e) => {
            this.move(e.keyCode);
        };
    }

    init(){
        this.initArray();
        this.wasShift = true
        this.fillTable();
    };

    initArray() {
        this.array = [];
        for (let row = 0; row < 4; row++) {
            let row = [];
            for (let col = 0; col < 4; col++) {
                row.push(0);
            }
            this.array.push(row);
        }
    };
    drawTable() {
        if (this.containerHtml) {
            let table = document.createElement('table');
            table.classList.add('board');
            table.style.border = '1px solid black';
            for (let row = 0; row < 4; row++) {
                let tr = document.createElement('tr');
                for (let col = 0; col < 4; col++) {
                    let td = document.createElement('td');
                    td.style.textAlign = 'center';
                    td.style.verticalAlign = 'middle';
                    td.style.height = '100px';
                    td.style.width = '100px';
                    td.style.fontSize = '22px';
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            this.containerHtml.appendChild(table);
            this.table = table;
        }

    };
    fillTable() {
        let open = this.getOpenPositions();
        if(!open.length && this.isDeadlock()){
            let score = this.array.reduce((prev, current) => {let max = current.reduce((inprev, incurrent) => inprev < incurrent ? incurrent : inprev, 0); return max > prev ? max : prev}, 0)
            alert('Your score is ' + score);
            this.init();
        }else{
            if(this.wasShift){
                this.generateNumber(open);
            }
            for (let row = 0; row < 4; row++) {
                let tr = this.table.querySelectorAll('tr')[row];
                for (let col = 0; col < 4; col++) {
                    let td = tr.querySelectorAll('td')[col];
                    let value = this.array[row][col];
                    td.style.backgroundColor = value != 0 ? this.colorDictionary[Math.log2(value) - 1] : "rgb(255, 255, 255)";
                    td.innerText = value || '';
                }
            }
        }
    };
    move(direction) {
        if([37, 38, 39, 40].includes(direction)){
            this.wasShift = false;
        }
        switch (direction) {
            case 37:
                for (let row = 0; row < 4; row++) {
                    let arr = this.array[row];
                    this.array[row] = this.shift(this.sum(arr, 'L'), 'L');
                }
                this.fillTable();
            break;
            case 38:
                for(let col = 0; col < 4; col++){
                    let arr = [];
                    for(let row = 0; row < 4; row++){
                        arr.push(this.array[row][col]);
                    }
                    arr = this.shift(this.sum(arr, 'L'), 'L');
                    for(let row = 0; row < 4; row++){
                        this.array[row][col] = arr[row];
                    }
                }
                this.fillTable();
            break;
            case 39:
                for (let row = 0; row < 4; row++) {
                    let arr = this.array[row];
                    this.array[row] = this.shift(this.sum(arr, 'R'), 'R');
                }
                this.fillTable();
            break;
            case 40:
                for(let col = 0; col < 4; col++){
                    let arr = [];
                    for(let row = 0; row < 4; row++){
                        arr.push(this.array[row][col]);
                    }
                    arr = this.shift(this.sum(arr, 'R'), 'R');
                    for(let row = 0; row < 4; row++){
                        this.array[row][col] = arr[row];
                    }
                }
                this.fillTable();
            break;
        }
    };
    sum(arr, dir) {
        switch(dir){
            case 'L':
                var col = 0;
                while (col < 4) {
                    if (arr[col]) {
                        let next = col+1;
                        while(next < 4){
                            if(arr[next]){
                                if(arr[col] == arr[next]){
                                    arr[col] *= 2;
                                    arr[next] = 0;
                                }
                                break;
                            }
                            next++;
                        }
                    }
                    col++;
                }
            break;
            case 'R':
                var col = 3;
                while (col > 0) {
                    if (arr[col]) {
                        let next = col-1;
                        while(next >= 0){
                            if(arr[next]){
                                if(arr[col] == arr[next]){
                                    arr[col] *= 2;
                                    arr[next] = 0;
                                }
                                break;
                            }
                            next--;
                        }
                    }
                    col--;
                }
            break;
        }
        
        return arr;
    };
    shift(arr, dir){
        switch(dir){
            case 'R':
                arr = arr.sort((a, b) => {
                    if(!b && a){
                        this.wasShift = true;
                    }
                    return !b && a ? 1 : 0;
                });
            break;
            case 'L':
                arr = arr.sort((a, b) => {
                    if(!a && b){
                        this.wasShift = true;
                    }
                    return !a && b ? 1 : 0;
                });
            break;
        }
        return arr;
    };
    generateNumber(positions){       
        if(positions.length){
            let number = Math.random() > 0.5 ? 2 : 4;
            let position = Math.floor(Math.random() * positions.length);
            let row = positions[position][0];
            let col = positions[position][1];
            this.array[row][col] = number;
        }
    };
    getOpenPositions(){
        let positions = [];
        for(let row = 0; row < 4; row++){
            for(let col = 0; col < 4; col++){
                if(!this.array[row][col]){
                    positions.push([row, col]);
                }
            }
        }
        return positions;
    };
    isDeadlock(){
        for(let row = 0; row < 4; row++){
            for(let col = 0; col < 4; col++){
                if(col != 3 && this.array[row][col] === this.array[row][col+1]){
                    return false;
                }
                if(row != 3 && this.array[row][col] == this.array[row+1][col]){
                    return false;
                }
            }
        }
        return true;
    };
    getColorDictionary(){
        let r = 105; let step = 20;
        const diff = 255 - r;
        let dictionary = [];
        for(let n = 0; n < 30; n++){
            let value = n * step;
            if(value > diff * 3){
                dictionary.push('rgb(255, 255, 255)');
            }else if(value <= diff){
                let color = `rgb(${r+value}, ${r}, ${r})`;
                dictionary.push(color);
            }else if(value > diff && value <= diff * 2){
                value = value - diff;
                let color = `rgb(${r}, ${r+value}, ${r})`;
                dictionary.push(color);
            }else{
                value = value - 2 * diff;
                let color = `rgb(${r}, ${r}, ${r+value})`;
            }
        }
        return dictionary;
    };
}