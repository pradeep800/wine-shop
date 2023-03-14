/*
 * Footer
 */
import Image from "next/image";
import Link from "next/link";
export default function Footer() {
  return (
    <div className="px-3 py-1  text-sm font-normal  flex w-[100%] items-center flex-col pt-3">
      <div className="mb-1">
        All rights are opened. This website is for project purposes only and
        does not claim any ownership or copyright.
      </div>
      <div>
        <div className="flex gap-8">
          <Link href="https://twitter.com/pradeep14880712">
            <Image
              width={30}
              height={30}
              alt="twitter"
              src="/static/images/twitter.png"
            />
          </Link>
          <Link href="https://github.com/pradeep800">
            <Image
              width={30}
              height={30}
              alt="github"
              src="/static/images/github.png"
            />
          </Link>
          <Link href="mailto:pradeep8b0@gmail.com">
            <Image
              width={30}
              height={30}
              alt="gmail"
              src="/static/images/gmail.png"
            />
          </Link>
        </div>
        <Link
          className="pl-10 hover:underline hover:decoration-slate-500"
          href="https://github.com/pradeep800/wine-shop"
        >
          Source Code
        </Link>
      </div>
    </div>
  );
}
