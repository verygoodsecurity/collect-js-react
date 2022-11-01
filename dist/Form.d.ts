interface Collect {
    create: Function;
}
declare global {
    interface Window {
        VGSCollect: Collect;
    }
}
export declare const CollectForm: (props: any) => JSX.Element;
export {};
