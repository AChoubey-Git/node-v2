import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const expression = calcBody.expression.replace(/\s+/g, '');
    if (expression) {
      const regex = /(?<!\S)[0-9]+(?:[-+*\/]+?\d+(?:\.\d+)?)+(?!\S)/g;
      if (regex.test(expression)) {
        let stack = [];
        let num = 0;
        let sign = '+';
        for (let i = 0; i < expression.length; i++) {
          let c = expression[i];
          if (!isNaN(parseInt(c))) {
            num = num * 10 + parseInt(c);
          }
          if (
            (isNaN(parseInt(c)) && c !== ' ') ||
            i === expression.length - 1
          ) {
            switch (sign) {
              case '+':
                stack.push(num);
                break;
              case '-':
                stack.push(-num);
                break;
              case '*':
                stack.push(stack.pop() * num);
                break;
              case '/':
                stack.push(Math.trunc(stack.pop() / num));
                break;
            }
            sign = c;
            num = 0;
          }
        }
        let sum = 0;
        while (stack.length) {
          sum += stack.pop();
        }
        return sum;
      }
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }
  }
}
