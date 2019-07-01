import Database from "./mysql/Database";

export { Database as MySQL };

declare global {
	function Override (target: any, property: string): void;
}

(global as any).Override = () => { };
