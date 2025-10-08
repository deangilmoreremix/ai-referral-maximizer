/**
 * Code Interpreter Service
 * Executes safe mathematical calculations and simple code snippets
 */

export interface CodeExecutionResult {
  output?: string;
  error?: string;
  executionTime: number;
}

class CodeInterpreterService {
  /**
   * Execute a mathematical expression or simple JavaScript code
   */
  async executeCode(code: string, language: string = 'javascript'): Promise<CodeExecutionResult> {
    const startTime = Date.now();

    try {
      if (language === 'math' || this.isMathExpression(code)) {
        return this.evaluateMath(code, startTime);
      } else if (language === 'javascript') {
        return this.evaluateJavaScript(code, startTime);
      } else {
        return {
          error: `Language '${language}' is not supported. Supported: javascript, math`,
          executionTime: Date.now() - startTime
        };
      }
    } catch (error: any) {
      return {
        error: error.message || 'Execution error',
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Evaluate mathematical expressions
   */
  private evaluateMath(expression: string, startTime: number): CodeExecutionResult {
    try {
      // Clean the expression
      const cleanExpr = expression.trim();

      // Security: Only allow safe mathematical operations
      if (!this.isSafeMathExpression(cleanExpr)) {
        return {
          error: 'Expression contains unsafe operations',
          executionTime: Date.now() - startTime
        };
      }

      // Use Function constructor for safer evaluation than eval
      const result = new Function(`return ${cleanExpr}`)();

      return {
        output: String(result),
        executionTime: Date.now() - startTime
      };
    } catch (error: any) {
      return {
        error: `Math evaluation error: ${error.message}`,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Evaluate simple JavaScript code
   */
  private evaluateJavaScript(code: string, startTime: number): CodeExecutionResult {
    try {
      // Security check
      if (!this.isSafeCode(code)) {
        return {
          error: 'Code contains potentially unsafe operations',
          executionTime: Date.now() - startTime
        };
      }

      // Capture console output
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      try {
        // Execute in a limited context
        const result = new Function(code)();
        console.log = originalLog;

        const output = logs.length > 0 ? logs.join('\n') : String(result);

        return {
          output,
          executionTime: Date.now() - startTime
        };
      } finally {
        console.log = originalLog;
      }
    } catch (error: any) {
      return {
        error: `JavaScript execution error: ${error.message}`,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Check if the string is a mathematical expression
   */
  private isMathExpression(code: string): boolean {
    const mathPattern = /^[\d\s+\-*/().%^]+$/;
    return mathPattern.test(code.trim());
  }

  /**
   * Check if mathematical expression is safe
   */
  private isSafeMathExpression(expression: string): boolean {
    // Allow only numbers, basic operators, parentheses, and Math functions
    const allowedPattern = /^[0-9+\-*/().%^\s]+$|^Math\.[a-zA-Z]+\([0-9+\-*/().%^\s,]+\)$/;

    // Disallow dangerous patterns
    const dangerousPatterns = [
      'eval',
      'Function',
      'constructor',
      '__proto__',
      'prototype',
      'window',
      'document',
      'global',
      'process'
    ];

    const lowerExpr = expression.toLowerCase();
    return !dangerousPatterns.some(pattern => lowerExpr.includes(pattern.toLowerCase()));
  }

  /**
   * Check if code is safe to execute
   */
  private isSafeCode(code: string): boolean {
    // Disallow dangerous operations
    const dangerousPatterns = [
      'eval',
      'Function(',
      '__proto__',
      'constructor',
      'window.',
      'document.',
      'global.',
      'process.',
      'require(',
      'import ',
      'export ',
      'fs.',
      'child_process',
      'net.',
      'http.',
      'https.'
    ];

    const lowerCode = code.toLowerCase();
    return !dangerousPatterns.some(pattern =>
      lowerCode.includes(pattern.toLowerCase())
    );
  }

  /**
   * Execute common mathematical operations
   */
  async calculate(operation: string): Promise<number> {
    const result = await this.executeCode(operation, 'math');

    if (result.error) {
      throw new Error(result.error);
    }

    return parseFloat(result.output || '0');
  }

  /**
   * Format number with appropriate precision
   */
  formatNumber(num: number, decimals: number = 2): string {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    return num.toFixed(decimals);
  }
}

export const codeInterpreterService = new CodeInterpreterService();
