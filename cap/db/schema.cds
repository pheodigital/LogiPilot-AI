namespace logipilot.freight;

entity Carriers {
    key ID      : String(20);
        name    : String(100);
        country : String(3);
        rating  : Decimal(5,2);
}

entity Locations {
    key ID         : String(20);
        name       : String(100);
        country    : String(3);
        city       : String(100);
        postalCode : String(20);
}

entity FreightOrders {
    key ID          : String(20);
        status      : String(30);
        creationDate : Date;
        plannedStart : Date;
        plannedEnd   : Date;
        actualStart  : Date;
        actualEnd    : Date;
        origin       : Association to Locations;
        destination  : Association to Locations;
        carrier      : Association to Carriers;
        freightUnits : Association to many FreightUnits on freightUnits.freightOrder = $self;
        totalCost    : Decimal(15,2);
        currency     : String(3);
}

entity FreightUnits {
    key ID             : String(20);
        freightOrder   : Association to FreightOrders;
        weight         : Decimal(15,3);
        weightUnit     : String(10);
        volume         : Decimal(15,3);
        volumeUnit     : String(10);
}

entity Shipments {
    key ID             : String(20);
        freightOrder   : Association to FreightOrders;
        status         : String(30);
        plannedDelivery : Date;
        actualDelivery  : Date;
        origin          : Association to Locations;
        destination     : Association to Locations;
}