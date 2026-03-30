export declare class Server {
    private app;
    private port;
    constructor();
    listen(): void;
    routes(): void;
    middlewares(): void;
    dbConexion(): Promise<void>;
}
export default Server;
//# sourceMappingURL=server.d.ts.map