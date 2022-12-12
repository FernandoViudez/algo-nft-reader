export interface IndexerCredentials {
    host: string;
    token: Record<string, string> | string;
    port: string | number;
}