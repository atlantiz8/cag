function ParkMiller()
{
	var s;
	this.seed =function( seeder ) //uint
	{
		s = seeder > 1 ? seeder % 2147483647 : 1;
	}
	this.autoseed =function( ) //uint
	{
		var seeder = Math.floor(Math.random() * 2147483647);
		s = seeder > 1 ? seeder % 2147483647 : 1;
	}

	this.uniform = function()
	{

		return ( ( s = ( s * 16807 ) % 2147483647 ) / 2147483647 );
	}
}