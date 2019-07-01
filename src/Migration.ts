export default abstract class Migration<From, To> {
	public abstract up (): void;
	public abstract down (): void;
}
