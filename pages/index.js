import MeetupList from "@/components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content='Browse a HUGE list of meetups'></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

//doesn't run during build process runs for every page request
//only runs on server
// good if data changes frequently and/or you need to work with the incoming request (i.e. authentication)
// export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;
//     return{
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     };
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://bknox:rFuVp2djjcbIkqrG@next-js.czvxtqo.mongodb.net/?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //frequency of how often nextjs we rebuild the serverside pages for data changes
  };
}

export default HomePage;
