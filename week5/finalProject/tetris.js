const tetrisShape = [
  { name: 0, color: 'white' },
  {
    name: 1,
    pattern:
      [[[0, 1, 1], [0, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 1], [0, 0, 0]]],
    color: 'yellow'
  },
  {
    name: 2,
    pattern:
      [[[0, 2, 0], [2, 2, 2], [0, 0, 0]],
      [[0, 2, 0], [0, 2, 2], [0, 2, 0]],
      [[0, 0, 0], [2, 2, 2], [0, 2, 0]],
      [[0, 2, 0], [2, 2, 0], [0, 2, 0]]],
    color: 'pink'
  },
  {
    name: 3,
    pattern:
      [[[3, 3, 0], [0, 3, 3], [0, 0, 0]],
      [[0, 0, 3], [0, 3, 3], [0, 3, 0]],
      [[3, 3, 0], [0, 3, 3], [0, 0, 0]],
      [[0, 0, 3], [0, 3, 3], [0, 3, 0]]],
    color: 'greenyellow'
  },
  {
    name: 4,
    pattern:
      [[[0, 4, 4], [4, 4, 0], [0, 0, 0]],
      [[0, 4, 0], [0, 4, 4], [0, 0, 4]],
      [[0, 4, 4], [4, 4, 0], [0, 0, 0]],
      [[0, 4, 0], [0, 4, 4], [0, 0, 4]]],
    color: 'coral'
  },
  {
    name: 5,
    pattern:
      [[[5, 5, 5], [0, 0, 5], [0, 0, 0]],
      [[0, 0, 5], [0, 0, 5], [0, 5, 5]],
      [[0, 0, 0], [5, 0, 0], [5, 5, 5]],
      [[5, 5, 0], [5, 0, 0], [5, 0, 0]]],
    color: 'purple'
  },
  {
    name: 6,
    pattern:
      [[[6, 6, 6], [6, 0, 0], [0, 0, 0]],
      [[0, 6, 6], [0, 0, 6], [0, 0, 6]],
      [[0, 0, 0], [0, 0, 6], [6, 6, 6]],
      [[6, 0, 0], [6, 0, 0], [6, 6, 0]]],
    color: 'blue'
  },
  {
    name: 7,
    pattern:
      [[[0, 0, 0, 0], [7, 7, 7, 7], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 0, 7, 0], [0, 0, 7, 0], [0, 0, 7, 0], [0, 0, 7, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [7, 7, 7, 7], [0, 0, 0, 0]],
      [[0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0]]],
    color: 'red'
  }
];


class TetrisModel {
  constructor() {
    this.model = Array.from({ length: 20 }, () =>
      Array.from({ length: 10 }, () => 0));
    this.currentTopLeft = [0, 3];
    this.block = null;
    this.nextBlock = this.createBlock();
    this.currentShapeIndex = 0;
    this.score = 0;
  }

  run() {
    this.currentTopLeft = [0, 3];
    this.currentShapeIndex = 0;
    this.block = this.nextBlock;
    this.nextBlock = this.createBlock();
    this.puttingInModel(this.block[0]);
  }

  createBlock() {
    const block = tetrisShape[Math.ceil(Math.random() * 7)].pattern;
    return block;
  }

  puttingInModel(block) {
    block.forEach((tr, i) => {
      tr.forEach((td, j) => {
        this.model[i][j + 3] = td;
      })
    })
  }

  isActiveBlock = value => (value > 0 && value < 10);

  isInvalidBlock = value => (value === undefined || value < 0);

  goingDownBlock() {
    const [xPos, yPos] = this.currentTopLeft;
    let isStopOk = true;
    const activeBlocks = [];
    let currentBlockShape = this.block[0];
    for (let i = xPos; i < xPos + currentBlockShape.length; i++) { // 아래 블럭이 있으면
      if (i < 0 || i >= 20) continue;
      for (let j = yPos; j < yPos + currentBlockShape.length; j++) {
        if (this.isActiveBlock(this.model[i][j])) { // 현재 움직이는 블럭이면
          activeBlocks.push([i, j]);
          if (this.isInvalidBlock(this.model[i + 1] && this.model[i + 1][j])) { //밑에 있는 라인으로 움직일 수 있는지 체크
            isStopOk = false;
          }
        }
      }
    }
    if (!isStopOk) {
      activeBlocks.forEach(ele => {
        this.model[ele[0]][ele[1]] *= -1;
      });
      this.clearRows();
      this.run();
      return false;
    } else if (isStopOk) {
      for (let i = this.model.length - 1; i >= 0; i--) {
        const tr = this.model[i];
        tr.forEach((td, j) => {
          if (td > 0 && this.model[i + 1] && this.model[i + 1][j] >= 0) {
            this.model[i + 1][j] = td;
            this.model[i][j] = 0;
          }
        });
      }
      this.currentTopLeft = [xPos + 1, yPos];
      return true;
    }
  }

  clearRows() { //가득 찬 줄 있으면 지우고 새로 그려주기
    const fullRows = [];
    for (let i = 0; i < this.model.length; i++) {
      let count = 0;
      for (let j = 0; j < this.model[i].length; j++) {
        if (this.model[i][j] < 0) {
          count++;
        }
      }
      if (count === 10) {
        fullRows.push(i);
      }
    }

    fullRows.forEach(ele => {
      this.model.splice(ele, 1);
      this.model.unshift(Array.from({ length: 10 }, () => 0));
      this.updateScore();
    })
  }

  checkRows() { //게임 오버 판단
    if (this.model[4][3] < 0 || this.model[4][4] < 0 || this.model[4][5] < 0) {
      if (this.model[3][3] !== 0 || this.model[3][4] !== 0 || this.model[3][5] !== 0) {
        if (this.model[2][3] !== 0 || this.model[2][4] !== 0 || this.model[2][5] !== 0) {
          return true;
        }
      }
      if (this.block[0].length === 4) {
        return true;
      }
    }
    return false;
  }

  updateScore() {
    this.score *= 2;
    if (this.score === 0) {
      this.score = 2;
    }
  }

  getModel() {
    return [...this.model];
  }
}

class RenderView {
  constructor({ tetrisModel, gameView, gameStartButton, gameStopButton, scoreBox, nextBlock }) {
    this.tetrisModel = tetrisModel;
    this.tetrisModel.run();
    this.gameView = gameView;
    this.gameStartButton = gameStartButton;
    this.gameStopButton = gameStopButton;
    this.scoreBox = scoreBox;
    this.nextBlock = nextBlock;
    this.timeClear = null;
    this.timer = 1000;
  }

  initEvent() {
    this.gameStartButton.addEventListener('click', this.startButtonClickHandler);
    this.gameStopButton.addEventListener('click', this.stopButtonClickHandler);
  }

  run() {
    this.renderingFromModel();
    this.movingGameStart();
  }

  down() {
    this.tetrisModel.goingDownBlock();
    this.renderingFromModel();
    this.renderingFromNextBlock();
  }

  renderingFromModel() {
    const template = `<table>` + this.tetrisModel.getModel().map((tr) =>
      `<tr>
     ${tr.map((td) => `<td class="${(tetrisShape[Math.abs(td)]).color}"></td>`).join('')}
      </tr>`
    ).join('') + `</table>`;
    this.gameView.innerHTML = template;
  }

  renderingFromNextBlock() {
    const { nextBlock } = this.tetrisModel;
    const template = `<table>${nextBlock[0].length === 3 ? `<tr><td></td><td></td><td></td><td></td></tr>` : ''}`
     + nextBlock[0].map(tr =>
      `<tr>
      ${tr.map((td) => `<td class="${(tetrisShape[Math.abs(td)]).color}"></td>`).join('')}
      ${nextBlock[0].length === 3 ? `<td></td>` : ''}
      </tr>`
    ).join('') + `</table>`;
    this.nextBlock.innerHTML = template;
  }

  movingGameStart() {
    this.timeClear = setTimeout(() => { this.movingGameStart() }, this.timer);
    if (this.tetrisModel.checkRows()) {
      clearTimeout(this.timeClear);
      alert(`game over 점수는 ${this.tetrisModel.score} 입니다`);
    };
    this.down();

    this.scoreBox.innerHTML = this.tetrisModel.score;
  }

  startButtonClickHandler = (event) => {
    this.run();
    this.gameStopButton.style.display = 'inline-block';
    event.target.replaceWith(this.gameStopButton);
  }

  stopButtonClickHandler = (event) => {
    clearTimeout(this.timeClear);
    event.target.replaceWith(this.gameStartButton);
  }
}

class ArrowKeysEventController {
  constructor({ tetrisModel, renderView }) {
    this.tetrisModel = tetrisModel;
    this.renderView = renderView;
  }

  initEvent() {
    document.addEventListener('keydown', this.moveLeftAndRightHandler);
    document.addEventListener('keydown', this.turnHandler);
    document.addEventListener('keydown', this.downHandler);
  }

  moveLeftAndRightHandler = (event) => { //왼쪽 오른쪽으로 움직이기
    const left = -1;
    const right = 1;
    let way = 0;
    if (event.code === 'ArrowLeft') {
      way = left;
    } else if (event.code === 'ArrowRight') {
      way = right;
    }
    const { model, currentTopLeft } = this.tetrisModel;
    switch (event.code) {
      case 'ArrowLeft': {
        let isMoveOk = this.placeCheck(way);
        if (isMoveOk) {
          currentTopLeft[1] -= 1;
          model.forEach((tr, i) => {
            for (let j = 0; j < tr.length; j++) {
              const td = tr[j];
              if (model[i][j - 1] === 0 && td > 0) {
                model[i][j - 1] = td;
                model[i][j] = 0;
              }
            }
          });
        }
        this.renderView.renderingFromModel();
        break;
      }
      case 'ArrowRight': {
        let isMoveOk = this.placeCheck(way);
        if (isMoveOk) {
          currentTopLeft[1] += 1;
          model.forEach((tr, i) => {
            for (let j = tr.length - 1; j >= 0; j--) {
              const td = tr[j];
              if (model[i][j + 1] === 0 && td > 0) {
                model[i][j + 1] = td;
                model[i][j] = 0;
              }
            }
          });
        }
        this.renderView.renderingFromModel();
        break;
      }
    }
  }

  placeCheck(way) { //왼쪽 or 오른쪽 공간체크하기
    let isMoveOk = true;
    const { block, currentTopLeft, model, isActiveBlock, isInvalidBlock } = this.tetrisModel;
    const currentBlockShape = block[0];
    const [xPos, yPos] = currentTopLeft;
    for (let i = xPos; i < xPos + currentBlockShape.length; i++) {
      if (!isMoveOk) break;
      for (let j = yPos; j < yPos + currentBlockShape.length; j++) {
        if (!model[i]) continue;
        if (isActiveBlock(model[i][j]) &&
          isInvalidBlock(model[i] && model[i][j + way])) {
          isMoveOk = false;
        }
      }
    }
    return isMoveOk;
  }


  turnHandler = (event) => { // 도형 회전
    if (event.code === 'ArrowUp') {
      let isTurnOk = true;
      const { currentShapeIndex, currentTopLeft, block, model, isInvalidBlock, goingDownBlock } = this.tetrisModel;
      const currentBlockShape = block[currentShapeIndex]
      const nextShapeIndex = currentShapeIndex === 3 ? 0 : currentShapeIndex + 1;
      const nextBlockShape = block[nextShapeIndex];

      const [xPos, yPos] = currentTopLeft

      for (let i = xPos; i < xPos + currentBlockShape.length; i++) { // 돌린 이후 공간 체크
        if (!isTurnOk) break;
        if (i === 20) isTurnOk = false;
        for (let j = yPos; j < yPos + currentBlockShape.length; j++) {
          if (!model[i]) {
            continue;
          }
          if (nextBlockShape[i - xPos][j - yPos] !== 0 &&
            isInvalidBlock(model[i] && model[i][j])) {
            isTurnOk = false;
          }
        }
      }
      if (isTurnOk) {
        while (xPos < 0) {
          goingDownBlock();
        }
        for (let i = xPos; i < xPos + currentBlockShape.length; i++) { // 돌린 이후 공간 체크
          for (let j = yPos; j < yPos + currentBlockShape.length; j++) {
            if (!model[i]) continue;
            let nextBlockShapeCell = nextBlockShape[i - xPos][j - yPos];
            if (nextBlockShapeCell !== 0 && model[i][j] === 0) {
              // 다음 모양은 색깔이 있는데 현재칸이 데이터 및 색깔이 없으면
              model[i][j] = block[1][1][2]; //데이터 및 색깔 부여
            } else if (nextBlockShapeCell === 0 && model[i][j] && model[i][j] >= 0) {
              // 다음 모양은 색깔이 없는데 현재칸이 데이터 및 색깔이 있으면
              model[i][j] = 0;
            }
          }
        }
        this.tetrisModel.currentShapeIndex = nextShapeIndex;
      }
      this.renderView.renderingFromModel();
    }
  }

  downHandler = (event) => { //도형 내리기
    switch (event.code) {
      case 'ArrowDown': {
        this.renderView.down();
        break;
      }
      case 'Space': {
        while (this.tetrisModel.goingDownBlock()) { this.renderView.renderingFromModel(); };
        break;
      }
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const tetrisModel = new TetrisModel();

  const gameView = document.querySelector('.game_view');
  const gameStartButton = document.querySelector('.start_game');
  const gameStopButton = document.querySelector('.game_stop');
  const scoreBox = document.querySelector('.score');
  const nextBlock = document.querySelector('.next_block');
  const renderView = new RenderView({ tetrisModel, gameView, gameStartButton, gameStopButton, scoreBox, nextBlock });
  const arrowKeysEventController = new ArrowKeysEventController({ tetrisModel, renderView });
  renderView.initEvent();
  arrowKeysEventController.initEvent();

})