const { HelloWorldService } = require("src/services/hello");

describe("Hello world service", () => {
    test('.sayHello(): it should respond with "Hello World!"', async () => {
        const result = HelloWorldService.sayHello();
        expect(result).toBe("Hello World!");
    });
});