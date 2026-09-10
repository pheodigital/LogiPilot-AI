using { logipilot.freight as db } from '../db/schema';

@path: '/freight'
service FreightService {

    entity FreightOrders as projection on db.FreightOrders;
    entity FreightUnits  as projection on db.FreightUnits;
    entity Shipments     as projection on db.Shipments;
    entity Carriers      as projection on db.Carriers;
    entity Locations     as projection on db.Locations;

}