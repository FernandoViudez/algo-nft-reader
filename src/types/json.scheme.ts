// Used for arc 3 & arc 19
export interface ArcMetadata {
    name: string
    decimals: number
    description: string,
    image: string,
    "image_integrity": string,
    "image_mimetype": string,
    "background_color": string,
    "external_url": string,
    "external_url_integrity": string,
    "external_url_mimetype": string,
    "animation_url": string,
    "animation_url_integrity": string,
    "animation_url_mimetype": string,
    properties: Record<string, any>,
    "extra_metadata": string,
    localization: {
        uri: string,
        default: string,
        locales: string[],
        integrity?: {}
    }
}