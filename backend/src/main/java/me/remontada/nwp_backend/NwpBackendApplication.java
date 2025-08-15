package me.remontada.nwp_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NwpBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(NwpBackendApplication.class, args);
	}

}
