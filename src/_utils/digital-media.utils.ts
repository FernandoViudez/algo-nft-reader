export function formatMediaIntegrity(digitalMedia: any[]) {
    digitalMedia = digitalMedia.filter((value: any) => value.integrity);
    digitalMedia = digitalMedia.map(value => {
        if(value.integrity.startsWith('sha256-')) {
            value.integrity = value.integrity.split('sha256-').pop();
        }
        return value;
    });
    return digitalMedia;
}