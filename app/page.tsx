import { getSession } from "@auth0/nextjs-auth0";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

moment.locale("es");

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <nav className="fixed z-50 top-0 left-0 right-0 h-14 w-full shadow bg-white">
        <div className="mx-auto w-3/4 flex justify-between items-center my-1">
          <div className="flex gap-2 items-center">
            <div className="h-full w-12">
              <Image
                alt="Logo"
                className="h-full w-full"
                height={ 48  }
                src="https://personel-public-files-e42.s3.amazonaws.com/uq94kq9o-habits-logo-transparent-f7833392-a61a-4bcb-8a8e-2e9ada6d8dca.png"
                width={ 48 }
              />
            </div>
            <span>Habitosca</span>
          </div>
          <div className="w-fit h-full flex items-center justify-center">
            { !session && 
              <Link
                href="/api/auth/login"
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
              >
                Login
              </Link>
            }
            { session &&
               <div className="w-full h-full flex flex-row items-center gap-3 justify-between">
                <div className="flex gap-2 items-center">
                  <Link className="px-4 py-2 rounded-md bg-blue-500 text-white" href="/manager">
                    Ver mis hábitos
                  </Link>
                </div>
              </div>
            }
          </div>
        </div>
      </nav>
      <section className="h-fit pb-20 bg-[#ebeff4] pt-8 md:pt-14">
        <div className="grid md:grid-cols-2 h-full gap-4">
          <div className="col-span-1 md:col-start-1 row-span-1 bg-slate-1200">
            <div className="w-full lg:w-4/5 2xl:w-3/5 lg:ml-auto h-full flex items-center justify-center">
              <div className="relative h-5/6 w-full mx-8 md:mr-0">
                <Image
                  alt="3-weekprogress-examples"
                  height={ 500 }
                  width={ 500 }
                  layout="responsive"
                  src="https://personel-public-files-e42.s3.amazonaws.com/c75pdgzd-habits-progress-3-items-transparent-a0ed514c-fef4-4b04-8064-d5a2d75fb074.png" 
                />
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-start-2 row-span-1 mt-4 md:mt-0 px-8">
            <div className="w-full lg:w-4/5 2xl:w-3/5 mr-auto h-full flex items-center bg-red-1f00">
              <div>
                <h1 className="font-semibold text-4xl text-slate-700">Has tus hábitos efectivos</h1>
                <ul>
                  <li>
                    <p className="text-slate-500 text-lg mt-2">Domina tu día con una rutina diaria que te acerca a tus objetivos.</p>
                  </li>
                  <li>
                    <p className="text-slate-500 text-lg">Monitorea tu avance semanal y mantente en camino hacia el éxito.</p>
                  </li>
                </ul>
                {/* CTA */}
                <div className="flex gap-2 mt-6 items-center">
                  {/* <p className="text-slate-600">Empieza tu primer hábito ahora</p> */}
                  <Link
                    className="px-3 py-2 rounded-md bg-blue-500 text-white font-semibold text-lg"
                    href={ session ? "/manager" : "/api/auth/login"}
                  >
                    Empezar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
       <section className="grid md:grid-cols-2 pb-[20px] pt-8 md:pt-[40px] max-md:gap-8">
        <div className="col-span-1 col-start-1 mx-6 md:mx-auto text-slate-600 md:w-3/5">
          <h2 className="text-center text-slate-800 font-semibold text-2xl md:pt-12">Hazlo tuyo: Personaliza tus hábitos con estilo</h2>
          <ul className="list-disc list-inside mt-4 flex flex-col gap-2">
            <li className="">Colores</li>
            <li className="">Iconos</li>
            <li className="">Notificaciones</li>
          </ul>
        </div>
        <div className="bg-slate-200 w-full mx-auto py-8 md:col-start-2">
          <div className="h-full mx-auto px-8 w-full lg:w-1/2">
            <Image
              alt="habit-creator"
              className="w-[100px]"
              height={ 740 }
              width={ 520 }
              layout="responsive"
              src="https://personel-public-files-e42.s3.amazonaws.com/431tagju-habit-creator-1-aa01cbbc-9160-4eac-abe7-a543d5ed5bd6.png"
            />
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-2 py-4 md:py-[20px] max-md:gap-8">
        <div className="bg-slate-200 w-full col-start-1 mx-auto py-8">
          <Image
            alt="day-schedule"
            className="mx-auto"
            height={ 400 }
            width={ 400 }
            src="https://personel-public-files-e42.s3.amazonaws.com/vfj8eb8l-day-schedule-1-8ecca7b2-4acb-4bbc-b300-cf666a3881bc.png"
          />
        </div>
        <div className="col-span-1 max-md:row-start-1 md:col-start-2 w-3/5 mx-auto">
          <h2 className="text-center text-slate-800 font-semibold text-2xl md:pt-12">Seguimiento diario</h2>
          <p className="text-center text-slate-600">No te saltes ni un paso, recibe recordatorios drarios</p>
        </div>
      </section>
    </>
  );

  return redirect("/manager");
}
