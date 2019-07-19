package cmd

type totalWeather struct {
	january   mathWeather
	february  mathWeather
	march     mathWeather
	april     mathWeather
	may       mathWeather
	june      mathWeather
	july      mathWeather
	august    mathWeather
	september mathWeather
	october   mathWeather
	november  mathWeather
	december  mathWeather
}
type mathWeather struct {
	good int
	bad  int
}
