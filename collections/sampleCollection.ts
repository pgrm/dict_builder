/// <refrence path="../typings/tsd.d.ts" />

export interface ISampleCollection {
	_id?: Mongo.ObjectID;
	name: string;
	description?: string;
}

export var SampleCollection = new Mongo.Collection<ISampleCollection>('parties', {idGeneration: 'MONGO'});

