import { Frog } from "frog";
import { handle } from "frog/next";

const app = new Frog({
  basePath: "/api/frames",
  // Supply a Hub API URL to enable frame verification
  // hubApiUrl: "https://hubs.airstack.xyz",
});

// Frame for viewing an event
app.frame("/event/:eventId", (c) => {
  const { eventId } = c.req.param();
  
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #833ab4, #fd1d1d)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Commit2ShowUp</span>
          <span style={{ fontSize: 40, marginTop: 20 }}>Event #{eventId}</span>
        </div>
      </div>
    ),
    intents: [
      <button action={`/event/${eventId}/join`}>Join Event</button>,
      <button action={`/event/${eventId}/checkin`}>Check In</button>,
      <button.Link href={`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/events/${eventId}`}>
        View Details
      </button.Link>,
    ],
  });
});

// Frame for joining an event
app.frame("/event/:eventId/join", (c) => {
  const { eventId } = c.req.param();
  
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #833ab4, #fd1d1d)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 50,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Join Event #{eventId}
          <div style={{ fontSize: 30, marginTop: 20 }}>
            Stake 5 USDC to commit
          </div>
        </div>
      </div>
    ),
    intents: [
      <button.Link href={`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/events/${eventId}?action=join`}>
        Open App to Join
      </button.Link>,
      <button action={`/event/${eventId}`}>Back</button>,
    ],
  });
});

// Frame for checking in
app.frame("/event/:eventId/checkin", (c) => {
  const { eventId } = c.req.param();
  
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #833ab4, #fd1d1d)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 50,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Check In
          <div style={{ fontSize: 30, marginTop: 20 }}>
            Event #{eventId}
          </div>
        </div>
      </div>
    ),
    intents: [
      <button.Link href={`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/events/${eventId}?action=checkin`}>
        Open App to Check In
      </button.Link>,
      <button action={`/event/${eventId}`}>Back</button>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);

