package org.example.config;


import lombok.extern.slf4j.Slf4j;
import org.example.user.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private JwtUtil authUtil;
	
	
	

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
				
				

		String requestTokenHeader=request.getHeader("Authorization");
		String username=null;
		String jwtToken=null;
		
		if(requestTokenHeader!=null && requestTokenHeader.startsWith("Bearer ")) {
			jwtToken=requestTokenHeader.substring(7); 
		
		try{
			
			username=this.authUtil.extractUsername(jwtToken);
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		UserDetails userDetails=this.customUserDetailsService.loadUserByUsername(username);
	
		
		if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){

			//to authentcte token
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken	=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
			
			usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

			SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
			
		}else {
			log.info("Username :: {} SecurityContextHolder.getContext().getAuthentication() : {}",username, SecurityContextHolder.getContext().getAuthentication());
			System.out.println("token is not validated");
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken	=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());

			usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

			SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
		}
		}
		
	
		 
		filterChain.doFilter(request, response);
		
		
		
		
	}
	
	

}