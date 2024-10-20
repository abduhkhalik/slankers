import { LoginCard } from "../componets/Forms";

function Login() {
  return (
    <section >
      <div className="container">
        <div className="w-full h-[100vh] flex justify-center items-center">
          <div>
            <LoginCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
