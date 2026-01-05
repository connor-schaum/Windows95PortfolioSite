I spent some time diving deep into networking pricinciples to learn different types of Peer to Peer networking structures. I experiemented with Kademlia DHTs,
and traditional gossip based discovery mechanisms. I have been working on a Library in C to encapsulate many of these different structures. Right now, I am working
on implimenting and learning different security methods like forward and end-to-end encryption through the X3DH and Double Ratchet algorithms.

The current setup is a multithreaded P2P netowrking Library that uses a gossip style discovery method to find peers and broadcast messages across the mesh.
