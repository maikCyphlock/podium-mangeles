
CREATE TABLE public."Participant" (
  id text NOT NULL,
  "firstName" text NOT NULL,
  "lastName" text NOT NULL,
  email text NOT NULL,
  "birthDate" timestamp without time zone NOT NULL,
  gender text NOT NULL,
  country text NOT NULL,
  city text NULL,
  phone text NULL,
  "emergencyContact" text NULL,
  "bloodType" text NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL,
  "eventId" text NOT NULL,
  CONSTRAINT Participant_pkey PRIMARY KEY (id),
  CONSTRAINT Participant_eventId_fkey FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON UPDATE CASCADE ON DELETE CASCADE
);


-- db=AwWf8mpVVWnjYrMq