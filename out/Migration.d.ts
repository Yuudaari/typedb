export default abstract class Migration<From, To> {
    abstract up(): void;
    abstract down(): void;
}
