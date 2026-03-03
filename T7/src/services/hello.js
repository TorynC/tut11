class HelloWorldService {
    static data = "Hello World!";

    static sayHello() {
        return this.data;
    }
}

module.exports = { HelloWorldService };
