export default function Home({ title }) {
    return (
        <div className="text-4xl">
            <h1>Welcome to Inertia + React + Laravel</h1>
            <p>Title prop from controller: {title}</p>
        </div>
    );
}
